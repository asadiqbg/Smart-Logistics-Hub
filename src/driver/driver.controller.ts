import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('driver')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller('driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @ApiOperation({ summary: 'Create a new driver' })
  @Post()
  create(
    @CurrentTenant() tenantId: string,
    @Body() createDriverDto: CreateDriverDto,
  ): Promise<Driver> {
    return this.driverService.createDriver(createDriverDto, tenantId);
  }

  @ApiOperation({ summary: 'Get all drivers' })
  @Get()
  findAll(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
  ): Promise<Driver[]> {
    return this.driverService.findAll(tenantId, status);
  }

  @ApiOperation({ summary: 'Get a single driver by Id' })
  @Get(':id')
  findOne(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Driver> {
    return this.driverService.findOne(tenantId, id);
  }

  @ApiOperation({ summary: 'Update driver location' })
  @Patch(':id/location')
  updateLocation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocationDto: UpdateDriverLocationDto,
  ): Promise<Driver> {
    return this.driverService.updateLocation(tenantId, id, updateLocationDto);
  }

  @ApiOperation({ summary: 'Update driver status' })
  @Patch(':id/status')
  updateStatus(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: string,
  ): Promise<Driver> {
    return this.driverService.updateStatus(tenantId, id, status);
  }
}
