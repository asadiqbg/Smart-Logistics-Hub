import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  Point,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Order } from './order.entity';

@Entity('customers')
export class Customer extends BaseEntity {
  @Column({ name: 'tenant_id' })
  @Index()
  tenantId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  phone: string;

  @Column({
    name: 'default_address',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  defaultAddress: Point;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Order[];

  @ManyToOne(() => Tenant, (tenant) => tenant.drivers)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
