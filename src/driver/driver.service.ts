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

  async findOne(tenantId: string, id: string): Promise<Driver> {
    const driver = await this.driverRepository.findOne({
      where: { id, tenantId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    return driver;
  }

  async updateLocation(
    tenantId: string,
    id: string,
    updateLocationDto: UpdateDriverLocationDto,
  ): Promise<Driver> {
    const driver = await this.findOne(tenantId, id);
    const location: Point = {
      type: 'Point',
      coordinates: [updateLocationDto.longitude, updateLocationDto.latitude],
    };
    driver.currentLocation = location;
    return await this.driverRepository.save(driver);
  }

  async updateStatus(tenantId: string, id: string, status: string) {
    const driver = await this.findOne(tenantId, id);
    driver.status = status;
    return await this.driverRepository.save(driver);
  }

  async findNearestAvailable(
    tenantId: string,
    longitude: number,
    latitude: number,
    maxDistanceKm: number,
  ) {
    const drivers = await this.driverRepository
      .createQueryBuilder('driver')
      .where('driver.tenantId = :tenantId', { tenantId })
      .andWhere('driver.status = :status', { status: 'availabe' })
      .andWhere('driver.currentLocation IS NOT NULL')
      .andWhere(
        `ST_Distance(driver.currentLocation,
        ST_SetSRID(ST_MakePoint(:longitude,:latitude),4326)::geography
      ) < :maxDistance`,
        { longitude, latitude, maxDistance: maxDistanceKm * 1000 },
      )
      .orderBy(
        `ST_Distance(driver.currentLocation,
        ST_SetSRID(ST_MakePoint(:longitude,:latitude),4326)::geography`,
      )
      .setParameters({ latitude, longitude })
      .getMany();

    return drivers;
    /**
     SELECT *
      FROM driver
      WHERE tenantId = :tenantId
        AND status = 'available'
        AND currentLocation IS NOT NULL
        AND ST_Distance(
              driver.currentLocation,
              ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
            ) < :maxDistance
      ORDER BY ST_Distance(...)

     */
  }
}
