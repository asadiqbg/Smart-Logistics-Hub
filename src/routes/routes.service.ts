import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RouteStop } from 'src/database/entities/route-stop.entity';
import { Route } from 'src/database/entities/route.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateRouteDto } from './dto/create-route.dto';
import { OptimizationService } from './optimization/route-optimization';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name)

  constructor(
    @InjectRepository(Route)
    private routeRepository: Repository<Route>,
    @InjectRepository(RouteStop)
    private routeStopRepository: Repository<RouteStop>,
    private optimizationService: OptimizationService,
    private dataSource: DataSource,
    private orderService: OrdersService,

  ) { }

  async optimizeAndCreate(tenantId: string, createRouteDto: CreateRouteDto): Promise<Route[]> {

    this.logger.log(`Starting route optimization for ${createRouteDto.orderIds.length} orders`)

    const optimizationResults = await this.optimizationService.optimizeRoutesNearestNeighbor(tenantId, createRouteDto.orderIds)

    if (optimizationResults.length === 0) {
      throw new NotFoundException('No available orders or drivers')
    }

    const routes = await this.dataSource.transaction(async (manager: EntityManager): Promise<Route[]> => {
      const createdRoutes: Route[] = []
      for (const result of optimizationResults) {
        const route = manager.create(Route, {
          tenantId,
          driverId: result.driverId,
          status: 'planned',
          estimatedDurationMinutes: result.totalDuration,
          estimatedDistanceKm: result.totalDistance,
          optimizationScore: this.calculateOptimizationScore(result)
        })

        const savedRoute = await manager.save(Route, route)

        const stops = result.orders.map((order, index): RouteStop => {
          return manager.create(RouteStop, {
            routeId: savedRoute.id,
            orderId: order.id,
            stopSequence: index + 1,
            estimatedArrivalTime: this.calculateETA(index, result.orders),
            status: 'pending',
          })
        })

        await manager.save(RouteStop, stops)

        for (const order of result.orders) {
          await this.orderService.assignDriver(tenantId, order.id, result.driverId)
        }
        createdRoutes.push(savedRoute)
      }
      return createdRoutes
    })
    this.logger.log(`Created ${routes.length} optimized routes`)
    return routes
  }

  private calculateOptimizationScore(result: any): number {
    const avgDistancePerOrder = result.totalDistance / result.orders.length;
    const score = Math.max(0, 100 - avgDistancePerOrder * 2);
    return parseFloat(score.toFixed(2));
  }

  private calculateETA(stopIndex: number, orders: any[]): Date {
    const now = new Date();
    const minutesFromNow = stopIndex * 30;
    return new Date(now.getTime() + minutesFromNow * 60000);
  }
}
