import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { DriverModule } from 'src/driver/driver.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Route } from 'src/database/entities/route.entity';
import { RouteStop } from 'src/database/entities/route-stop.entity';
import { OptimizationService } from './optimization/route-optimization';

@Module({
  imports: [TypeOrmModule.forFeature([Route, RouteStop]), OrdersModule, DriverModule],
  providers: [RoutesService, OptimizationService],
  controllers: [RoutesController],


})
export class RoutesModule { }
