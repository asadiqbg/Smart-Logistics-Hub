import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { CurrentTenant } from 'src/common/decorators/tenant.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TenantGuard } from 'src/auth/guards/tenant.guard';
import { Driver } from 'src/database/entities/driver.entity';

@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Body() createDriverDto: CreateDriverDto,
  ): Promise<Driver> {
    return this.driverService.createDriver(createDriverDto, tenantId);
  }

  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
  ): Promise<Driver[]> {
    return this.driverService.findAll(tenantId, status);
  }

  @Get(':id')
  findOne(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Driver> {
    return this.driverService.findOne(tenantId, id);
  }
}
