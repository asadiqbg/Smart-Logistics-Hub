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

  //This is the Haversine formula, which calculates the great-circle distance between two points on a sphere. "Great-circle" means the shortest path along the surface of the sphere (like an airplane route
  private calculateEstimatedDuration(
    pickup: [number, number],
    delivery: [number, number],
  ): number {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers

    const lat1 = toRadians(pickup[0]);
    const lat2 = toRadians(delivery[0]);
    const deltaLat = toRadians(delivery[0] - pickup[0]);
    const deltaLon = toRadians(delivery[1] - pickup[1]);

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.ceil((distance / 30) * 60); // Assuming 30 km/h average speed
  }
}
