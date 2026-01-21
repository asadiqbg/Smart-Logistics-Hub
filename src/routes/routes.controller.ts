import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query, UseGuards } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { CurrentTenant } from 'src/common/decorators/tenant.decorator';
import { Route } from 'src/database/entities/route.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/auth/guards/tenant.guard';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('routes')
export class RoutesController {

  constructor(private readonly routesService: RoutesService) { }

  @Post('optimize')
  async optimize(@CurrentTenant() tenantId: string, @Body() createRouteDto: CreateRouteDto): Promise<Route[]> {
    console.log('tenantId in controller:', tenantId);
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
