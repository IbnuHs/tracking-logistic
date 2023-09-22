import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendAccessCodeModule } from './send-access-code/send-access-code.module';
import { TrackingLogisticModule } from './tracking-logistic/tracking-logistic.module';

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
