import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Route } from './route.entity';
import { Order } from './order.entity';

@Entity('route_stops')
export class RouteStop extends BaseEntity {
  @Column({ name: 'route_id' })
  @Index()
  routeId: string;

  @Column({ name: 'order_id' })
  @Index()
  orderId: string;

  @Column({ name: 'stop_sequence' })
  stopSequence: number;

  @Column({ name: 'estimated_arrival_time', type: 'timestamp' })
  estimatedArrivalTime: Date;

  @Column({ name: 'actual_arrival_time', nullable: true, type: 'timestamp' })
  actualArrivalTime: Date;

  @Column({ default: 'pending' })
  status: string;
}
