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

  @ManyToOne(() => Order, (order) => order.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order[];
}

/**
 * The `eventType` might be "order.created", "order.assigned", "order.picked_up", "order.delivered". The `eventData` jsonb column stores details specific to that event. For example, when assigning a driver, the event data might be:

javascript

```javascript
{
  driverId: '123e4567-e89b-12d3-a456-426614174000',
  driverName: 'John Driver',
  assignedAt: '2025-01-15T10:30:00Z'
}
```

The `createdBy` field tracks which user triggered the event. If a dispatcher manually reassigns an order, you'd store their user ID here. This is crucial for accountability and debugging.
 */
