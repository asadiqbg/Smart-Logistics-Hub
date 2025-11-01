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
import { Route } from './route.entity';

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

  //This creates a GIST (Generalized Search Tree) index optimized for geographic queries. Regular B-tree indexes work for equality or range queries, but spatial indexes handle "nearby" queries efficiently.
  @Column({
    name: 'current_location',
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  @Index({ spatial: true })
  currentLocation: Point;

  @ManyToOne(() => Tenant, (tenant) => tenant.drivers)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @OneToMany(() => Order, (order) => order.driver)
  orders: Order[];

  @OneToMany(() => Route, (route) => route.driver)
  routes: Route[];
}
