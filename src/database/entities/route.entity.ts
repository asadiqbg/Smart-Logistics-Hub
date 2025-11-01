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
import { Driver } from './driver.entity';
import { RouteStop } from './route-stop.entity';

@Entity('routes')
export class Route extends BaseEntity {
  @Column({ name: 'tenant_id' })
  @Index()
  tenantId: string;

  @Column({ name: 'driver_id' })
  @Index()
  driverId: string;

  @Column({ default: 'planned' })
  @Index()
  status: string;

  @Column({ name: 'estimated_duration_minutes' })
  estimatedDurationMinutes: number;

  @Column({
    name: 'estimated_distance_km',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  estimatedDistanceKm: number;

  @Column({
    name: 'optimization_score',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  optimizationScore: number;

  @Column({ name: 'started_at', nullable: true, type: 'timestamp' })
  startedAt: Date;

  @Column({ name: 'completed_at', nullable: true, type: 'timestamp' })
  completedAt: Date;

  @ManyToOne(() => Driver, (driver) => driver.routes)
  @JoinColumn({ name: 'driver_id' })
  driver: Driver;

  @OneToMany(() => RouteStop, (stop) => stop.route, { cascade: true })
  stops: RouteStop[];

  @ManyToOne(() => Tenant, (tenant) => tenant.drivers)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;
}
