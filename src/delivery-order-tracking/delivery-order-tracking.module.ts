import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrderTracking } from './entity/delivery-order-app.entity';
import { DeliveryOrderTrackingController } from './delivery-order-tracking.controller';
import { DeliveryOrderTrackingService } from './delivery-order-tracking.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryOrderTracking])],
  controllers: [DeliveryOrderTrackingController],
  providers: [DeliveryOrderTrackingService],
})
export class DeliveryOrderTrackingModule {}
