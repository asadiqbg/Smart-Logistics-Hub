import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/database/entities/customer.entity';

@Module({
  providers: [CustomerService],
  imports: [TypeOrmModule.forFeature([Customer])],
  exports: [CustomerService],
})
export class CustomerModule {}
