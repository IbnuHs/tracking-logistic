import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/tracking-logistic/Entities/customer.entity';
import { TrackingLogisticService } from 'src/tracking-logistic/tracking-logistic.service';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { SendAccessEmailDto } from './dto/sendAccessCodeEmail.dto copy';
import { WhatsappBaileysService } from './baileys.service';
import { OnApplicationBootstrap } from '@nestjs/common/interfaces';

@Injectable()
export class SendAccessCodeService implements OnApplicationBootstrap {
  constructor(
    private trackingLogisticService: TrackingLogisticService,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,

    private baileysService: WhatsappBaileysService,
  ) {}

  async onApplicationBootstrap() {
    await this.baileysService.initWhatsapp();
  }

  async findDataByDeliveryOrder(OrderNo: string) {
    return await this.deliveryOrderRepository.findOne({
      where: {
        OrderNo: OrderNo,
      },
      relations: {
        customer: true,
      },
    });
  }

  async sendViaEmail(sendEmailDto: SendAccessEmailDto) {
    const dataDeliveryOrder = await this.findDataByDeliveryOrder(
      sendEmailDto.OrderNo,
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'logistictesting33@gmail.com',
      to: dataDeliveryOrder.customer.Email,
      subject: 'Akses Kode Tracking Logistik',
      html: `Kode akses anda untuk pemesanan dengan nomor order <b>${sendEmailDto.OrderNo}</b> adalah <br> <b>${dataDeliveryOrder.Access}</b><br>Masukkan nomor untuk mengakses data. Harap jangan bagikan ke pihak lain.`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err,
        };
      }
    });
    return {
      statusCode: HttpStatus.OK,
      session: 'client',
      message: `Kode akses terkirim`,
      email: dataDeliveryOrder.customer.Email,
    };
  }
}
