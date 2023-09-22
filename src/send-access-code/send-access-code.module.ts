import { Module } from '@nestjs/common';
import { SendAccessCodeService } from './send-access-code.service';
import { SendAccessCodeController } from './send-access-code.controller';
import { TrackingLogisticController } from 'src/tracking-logistic/tracking-logistic.controller';
import { TrackingLogisticModule } from 'src/tracking-logistic/tracking-logistic.module';
import { TrackingLogisticService } from 'src/tracking-logistic/tracking-logistic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/tracking-logistic/Entities/customer.entity';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';

@Module({
  controllers: [SendAccessCodeController],
  providers: [SendAccessCodeService, TrackingLogisticService],
  imports: [
    TrackingLogisticModule,
    TypeOrmModule.forFeature([Customer, DeliveryOrder]),
  ],
})
export class SendAccessCodeModule {}
