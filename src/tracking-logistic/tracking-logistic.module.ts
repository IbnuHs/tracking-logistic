import { TrackingLogisticService } from './tracking-logistic.service';
import { TrackingLogisticController } from './tracking-logistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrder } from './Entities/delivery-order.entity';
import { Customer } from './Entities/customer.entity';
import { DeliveryOrderTracking } from './Entities/delivery-order-app.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryOrder, Customer, DeliveryOrderTracking]),
  ],
  controllers: [TrackingLogisticController],
  providers: [TrackingLogisticService],
  exports: [TrackingLogisticModule, TrackingLogisticService],
})
export class TrackingLogisticModule {}
