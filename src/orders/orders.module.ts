import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/database/entities/order.entity';
import { OrderEvent } from 'src/database/entities/order-event.entity';
import { CustomerModule } from 'src/customer/customer.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderEvent]),
    CustomerModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
