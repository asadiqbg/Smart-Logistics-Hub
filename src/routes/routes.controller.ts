import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { CurrentTenant } from 'src/common/decorators/tenant.decorator';
import { Route } from 'src/database/entities/route.entity';

@Controller('routes')
export class RoutesController {

  constructor(private readonly routesService: RoutesService) { }

  @Post('optimize')
  async optimize(@CurrentTenant() tenantId: string, @Body() createRouteDto: CreateRouteDto): Promise<Route[]> {
    return await this.routesService.optimizeAndCreate(tenantId, createRouteDto)
  }

  @Get()
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
  ): Promise<Route[]> {
    return this.routesService.findAll(tenantId, status);
  }

  @Get(':id')
  async findOne(@CurrentTenant() tenantId: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.routesService.findOne(tenantId, id)
  }

}
