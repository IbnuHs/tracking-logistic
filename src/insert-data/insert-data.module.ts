import { Module } from '@nestjs/common';
import { InsertDataService } from './insert-data.service';
import { InsertDataController } from './insert-data.controller';
import { Customer } from 'src/tracking-logistic/Entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, HttpService } from '@nestjs/axios';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { DeliveryOrderTracking } from 'src/tracking-logistic/Entities/delivery-order-app.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryOrder, Customer, DeliveryOrderTracking]),
    HttpModule.register({}),
    ScheduleModule.forRoot(),
  ],
  controllers: [InsertDataController],
  providers: [InsertDataService],
})
export class InsertDataModule {}
