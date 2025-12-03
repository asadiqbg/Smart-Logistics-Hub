import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Driver } from 'src/database/entities/driver.entity';
import { Repository } from 'typeorm';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Point } from 'geojson';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private driverRepository: Repository<Driver>,
  ) {}

  async createDriver(
    createDriverDto: CreateDriverDto,
    tenantId: string,
  ): Promise<Driver> {
    const driver = this.driverRepository.create({
      ...createDriverDto,
      tenantId,
    });
    return await this.driverRepository.save(driver);
  }

  async findAll(tenantId: string, status?: string): Promise<Driver[]> {
    const queryBuilder = await this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.tenantId = :tenantId', { tenantId });

    if (status) {
      queryBuilder.andWhere('driver.status = :status', { status });
    }
    return queryBuilder.getMany();
  }
}
