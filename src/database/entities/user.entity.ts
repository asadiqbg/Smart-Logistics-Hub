import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Tenant } from './tenant.entity';
import { Exclude } from 'class-transformer';

@Entity('users')
@Index(['tenantId', 'email'], { unique: true }) // composite unique index
//each tenant should have a unique user email, but multiple tenants can have same email
export class User extends BaseEntity {
  /**
   * Although our ManytoOne() creates a FK column of tenant_id automatically
   * we are creating a separate tenantId column for these reasons
   * lightweight, always available for filtering, unique constraints, indexing
   */
  @Column({ name: 'tenant_id' })
  tenantId: string;

  @Column()
  email: string;

  @Column({ name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  //design decision: we dont create a separate role entity
  //roles are fixed and rarely change(admin,dispatcher,viewer)
  @Column({ default: 'viewer' })
  role: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  tenant: Tenant;
}

/**
 * CREATE TABLE "users" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "tenant_id" uuid NOT NULL,
  "email" character varying NOT NULL,
  "password_hash" character varying NOT NULL,
  "role" character varying NOT NULL DEFAULT 'viewer',
  "created_at" TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
  CONSTRAINT "FK_users_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT "UQ_users_tenant_email" UNIQUE ("tenant_id", "email")
);

CREATE INDEX "IDX_users_tenant_email" ON "users" ("tenant_id", "email");

 */
