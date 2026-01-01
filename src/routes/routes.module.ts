import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { DriverModule } from 'src/driver/driver.module';

@Module({
  imports: [OrdersModule, DriverModule],
  providers: [RoutesService],
  controllers: [RoutesController],


})
export class RoutesModule { }
