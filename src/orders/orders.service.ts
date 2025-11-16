import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/customer/customer.service';
import { OrderEvent } from 'src/database/entities/order-event.entity';
import { Order } from 'src/database/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderEvent)
    private orderEventRepository: Repository<OrderEvent>,
    private readonly customerService: CustomerService,
    private eventEmitter: EventEmitter2,
  ) {}
  async create(
    tenantId: string,
    userId: string,
    createOrderDto: CreateOrderDto,
  ) {
    //check for customer validity
    const customer = this.customerService.findCustomerById(
      tenantId,
      createOrderDto.customerId,
    );

    if (!customer) {
      throw new UnauthorizedException('Customer not found');
    }
    //Build geoJson point objects for pickup and delivery points
    const pickupLocation = {
      type: 'Point',
      coordinates: [
        createOrderDto.pickup.coordinates[1],
        createOrderDto.pickup.coordinates[0],
      ],
    };
    const deliveryLocation = {
      type: 'Point',
      coordinates: [
        createOrderDto.delivery.coordinates[1],
        createOrderDto.delivery.coordinates[0],
      ],
    };
    //calculate esimated duration

    //create order

    //save order

    //create orderevent and store in db

    //generate event

    //return savedorder
  }
}
