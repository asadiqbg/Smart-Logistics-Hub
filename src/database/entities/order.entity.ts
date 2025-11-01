import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Customer } from './customer.entity';
import { Driver } from './driver.entity';
import { Point } from 'geojson';
import { RouteStop } from './route-stop.entity';
import { RoutesMapper } from '@nestjs/core/middleware/routes-mapper';
import { OrderEvent } from './order-event.entity';
import { join } from 'path';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ name: 'tenant_id' })
  @Index()
  tenantId: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'driver_id', nullable: true })
  @Index()
  driverId: string;

  @Column({ name: 'external_order_id', nullable: true })
  externalOrderId: string;

  @Column({ default: 'pending' })
  @Index()
  status: string;

  @Column({
    name: 'pickup_location',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Index({ spatial: true })
  pickupLocation: Point;

  @Column({
    name: 'delivery_location',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
  })
  @Index({ spatial: true })
  deliveryLocation: Point;

  @Column({ name: 'pickup_window_start', type: 'timestamp' })
  pickupWindowStart: Date;

  @Column({ name: 'pickup_window_end', type: 'timestamp' })
  pickupWindowEnd: Date;

  @Column({ name: 'delivery_window_start', type: 'timestamp' })
  deliveryWindowStart: Date;

  @Column({ name: 'delivery_window_end', type: 'timestamp' })
  deliveryWindowEnd: Date;

  @Column({ name: 'weight_kg', type: 'decimal', precision: 10, scale: 2 })
  weightKg: number;

  @Column({ name: 'dimensions_json', type: 'jsonb', nullable: true })
  dimensionsJson: any;

  @Column({ name: 'special_instructions', nullable: true })
  specialInstructions: string;

  @Column({ name: 'estimated_duration_minutes', nullable: true })
  estimatedDurationMinutes: number;

  @Column({ name: 'completed_at', nullable: true, type: 'timestamp' })
  completedAt: Date;

  @OneToMany(() => RouteStop, (stop) => stop.order)
  routeStops: RouteStop;

  @OneToMany(() => OrderEvent, (event) => event.order)
  events: OrderEvent[];

  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Driver, (driver) => driver.orders, { nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @ManyToOne(() => Tenant, (tenant) => tenant.drivers)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
