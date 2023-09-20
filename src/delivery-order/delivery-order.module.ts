import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrder } from './entity/delivery-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrder])],
})
export class DeliveryOrderModule {}
