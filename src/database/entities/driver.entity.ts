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

@Entity('drivers')
export class Driver extends BaseEntity {
  @Column({ name: 'tenant_id' })
  @Index()
  tenantId: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ name: 'license_number' })
  licenseNumber: string;

  @Column({ name: 'vehicle_type' })
  vehicleType: string;

  @Column({ name: 'capacity_kg', type: 'decimal', precision: 10, scale: 2 })
  capacityKg: number;

  @Column({ default: 'offline' })
  @Index()
  status: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.drivers)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
