import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrderTracking } from './entity/delivery-order-app.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrderTracking])],
})
export class DeliveryOrderTrackingModule {}
