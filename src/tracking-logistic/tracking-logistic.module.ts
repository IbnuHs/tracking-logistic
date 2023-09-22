import { Module } from '@nestjs/common';
import { TrackingLogisticService } from './tracking-logistic.service';
import { TrackingLogisticController } from './tracking-logistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrder } from './Entities/delivery-order.entity';
import { Customer } from './Entities/customer.entity';
import { DeliveryOrderTracking } from './Entities/delivery-order-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryOrder, Customer, DeliveryOrderTracking]),
  ],
  controllers: [TrackingLogisticController],
  providers: [TrackingLogisticService],
})
export class TrackingLogisticModule {}
