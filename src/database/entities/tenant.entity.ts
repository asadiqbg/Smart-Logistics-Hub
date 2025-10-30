import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Driver } from './driver.entity';
import { Customer } from './customer.entity';
import { Order } from './order.entity';
import { Route } from './route.entity';

@Entity('tenants')
export class Tenant extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ name: 'billing_plan', default: 'basic' })
  billingPlan: string;

  @Column({ name: 'subscription_status', default: 'active' })
  subscriptionStatus: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: User[];

  @OneToMany(() => Driver, (driver) => driver.tenant)
  drivers: Driver[];

  @OneToMany(() => Customer, (customer) => customer.tenant)
  customers: Customer[];

  @OneToMany(() => Route, (route) => route.tenant)
  routes: Route[];

  @OneToMany(() => Order, (order) => order.tenant)
  orders: Order[];
}
