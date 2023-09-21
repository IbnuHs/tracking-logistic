import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryOrderModule } from './delivery-order/delivery-order.module';
import { CustomerModule } from './customer/customer.module';
import { DeliveryOrderTrackingModule } from './delivery-order-tracking/delivery-order-tracking.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      database: 'tracking-logistic',
      password: '',
      autoLoadEntities: true,
      synchronize: true,
    }),
    DeliveryOrderModule,
    CustomerModule,
    DeliveryOrderTrackingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // CustomerService,
    // DeliveryOrderService,
    // DeliveryOrderTrackingService,
  ],
})
export class AppModule {}
