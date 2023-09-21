import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerModule } from 'src/customer/customer.module';
import { CustomerService } from 'src/customer/customer.service';
import { DeliveryOrderService } from './delivery-order.service';
import { DeliveryOrder } from './entity/delivery-order.entity';
import { DeliveryOrderController } from './delivery-order.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrder]), CustomerModule],
  providers: [DeliveryOrderService],
  controllers: [DeliveryOrderController],
})
export class DeliveryOrderModule {}
