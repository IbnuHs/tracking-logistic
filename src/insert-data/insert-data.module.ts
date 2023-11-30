import { Module } from '@nestjs/common';
import { InsertDataService } from './insert-data.service';
import { InsertDataController } from './insert-data.controller';
import { Customer } from 'src/tracking-logistic/Entities/customer.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { DeliveryOrderTracking } from 'src/tracking-logistic/Entities/delivery-order-app.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DeliveryOrder, Customer, DeliveryOrderTracking]),
    HttpModule.register({}),
  ],
  controllers: [InsertDataController],
  providers: [InsertDataService],
})
export class InsertDataModule {}
