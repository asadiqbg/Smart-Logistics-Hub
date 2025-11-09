import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';

dotenv.config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT!) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'logistics_hub',
    entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    synchronize: false,
  });

  try {
    // Create tenant
    const tenantRepo = dataSource.getRepository(Tenant);
    const tenant = await tenantRepo.save({
      name: 'Demo Logistics Co',
      slug: 'demo-logistics',
      billingPlan: 'premium',
      subscriptionStatus: 'active',
    });
    console.log('✅ Tenant created:', tenant.id);
    console.log('\n🎉 Seed completed successfully!\n');
  } catch (error) {
    console.log('seed failed', error);
  } finally {
    await dataSource.destroy();
  }
  seed();
}
