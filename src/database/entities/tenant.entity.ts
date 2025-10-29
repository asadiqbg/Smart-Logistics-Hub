import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

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
}
