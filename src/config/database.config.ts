import { registerAs } from '@nestjs/config';

// 'registerAs' lets you build a configuration object under a custom namespace
export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432') || 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  name: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC === 'true' ? true : false,
  autoLoad: process.env.AUTO_LOAD === 'true' ? true : false,
}));
