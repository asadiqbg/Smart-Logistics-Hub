import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/database/entities/customer.entity';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Point } from 'geojson';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findCustomerById(tenantId: string, customerId: string) {
    return this.customerRepository.findOne({
      where: { id: customerId, tenantId },
    });
  }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    const newCustomer = this.customerRepository.create({
      ...createCustomerDto,
      //check if default address exists, if so, convert to geoJSON Point
      defaultAddress: createCustomerDto.defaultAddress
        ? ({
            type: 'Point',
            coordinates: createCustomerDto.defaultAddress.coordinates,
          } as Point)
        : undefined,
    });

    return this.customerRepository.save(newCustomer);
  }
}
