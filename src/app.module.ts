import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendAccessCodeModule } from './send-access-code/send-access-code.module';
import { TrackingLogisticModule } from './tracking-logistic/tracking-logistic.module';
import { RatingModule } from './rating/rating.module';
import { CustomerServiceModule } from './customer-service/customer-service.module';
import { QuickOrderModule } from './quick-order/quick-order.module';

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
    // Delivery,
    // CustomerModule,
    // DeliveryOrderTrackingModule,
    SendAccessCodeModule,
    TrackingLogisticModule,
    RatingModule,
    CustomerServiceModule,
    QuickOrderModule,
  ],
  controllers: [
    // AppController
  ],
  providers: [
    // AppService,
    // CustomerService,
    // DeliveryOrderService,
    // DeliveryOrderTrackingService,
  ],
})
export class AppModule {}
