import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/customer/customer.service';
import { OrderEvent } from 'src/database/entities/order-event.entity';
import { Order } from 'src/database/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
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
    const estimatedDuration = this.calculateEstimatedDuration(
      createOrderDto.pickup.coordinates,
      createOrderDto.delivery.coordinates,
    );
    //create order
    const order = this.orderRepository.create({
      tenantId,
      customerId: createOrderDto.customerId,
      externalOrderId: createOrderDto.externalOrderId,
      pickupLocation: pickupLocation as any,
      deliveryLocation: deliveryLocation as any,
      pickupWindowStart: new Date(createOrderDto.pickup.windowStart),
      pickupWindowEnd: new Date(createOrderDto.pickup.windowEnd),
      deliveryWindowStart: new Date(createOrderDto.delivery.windowStart),
      deliveryWindowEnd: new Date(createOrderDto.delivery.windowEnd),
      weightKg: createOrderDto.package.weightKg,
      dimensionsJson: createOrderDto.package.dimensions,
      specialInstructions: createOrderDto.package.specialInstructions,
      estimatedDurationMinutes: estimatedDuration,
      status: OrderStatus.PENDING,
    });
    //save order
    const savedOrder = await this.orderRepository.save(order);
    //create orderevent and store in db
    await this.createOrderEvent(
      savedOrder.id,
      'order.created',
      { order: savedOrder },
      userId,
    );

    //generate event
    this.eventEmitter.emit('order.created', {
      orderId: savedOrder.id,
      tenantId,
      customerId: savedOrder.customerId,
    });
    //return savedorder
    this.logger.log(`Order created:${savedOrder.id}`);
    return savedOrder;
  }
  //createOrderEvent: save order in orderEvent once created
  private async createOrderEvent(
    orderId: string,
    eventType: string,
    eventData: any,
    createdBy: string | null,
  ) {
    const event = this.orderEventRepository.create({
      orderId,
      eventType,
      eventData,
      createdBy: createdBy === null ? undefined : createdBy,
    });
    return this.orderEventRepository.save(event);
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
