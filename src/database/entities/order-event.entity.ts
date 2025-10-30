import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';

@Entity('order_events')
export class OrderEvent extends BaseEntity {
  @Column({ name: 'order_id' })
  @Index()
  orderId: string;

  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ name: 'event_data', type: 'jsonb' })
  eventData: any;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;
}
