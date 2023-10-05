import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TrackingLogisticService } from './tracking-logistic.service';
import { TrackingLogisticController } from './tracking-logistic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrder } from './Entities/delivery-order.entity';
import { Customer } from './Entities/customer.entity';
import { DeliveryOrderTracking } from './Entities/delivery-order-app.entity';
// import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryOrder, Customer, DeliveryOrderTracking]),
  ],
  controllers: [TrackingLogisticController],
  providers: [TrackingLogisticService],
  exports: [TrackingLogisticModule, TrackingLogisticService],
})
export class TrackingLogisticModule {}
