import { Module } from '@nestjs/common';
import { SendAccessCodeService } from './send-access-code.service';
import { SendAccessCodeController } from './send-access-code.controller';
import { TrackingLogisticModule } from 'src/tracking-logistic/tracking-logistic.module';
import { TrackingLogisticService } from 'src/tracking-logistic/tracking-logistic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/tracking-logistic/Entities/customer.entity';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { DeliveryOrderTracking } from 'src/tracking-logistic/Entities/delivery-order-app.entity';
import { WhatsappBaileysService } from './baileys.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SendAccessCodeController],
  providers: [
    SendAccessCodeService,
    TrackingLogisticService,
    WhatsappBaileysService,
  ],
  imports: [
    TrackingLogisticModule,
    TypeOrmModule.forFeature([Customer, DeliveryOrder, DeliveryOrderTracking]),
    ConfigModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        service: 'Gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASS,
        },
      },
    }),
  ],
})
export class SendAccessCodeModule {}
