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
import { SendAccessWADto } from './dto/sendAccessCodeWA.dto';

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
    });
  }

  async sendViaEmail(sendEmailDto: SendAccessEmailDto) {
    try {
      const dataDeliveryOrder = await this.findDataByDeliveryOrder(
        sendEmailDto.OrderNo,
      );

      if (!dataDeliveryOrder) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No data found',
        };
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_EMAIL,
          pass: process.env.GMAIL_PASS,
        },
      });
      const Access = dataDeliveryOrder.CustomerId.slice(-4);

      const mailOptions = {
        from: 'logistictesting33@gmail.com',
        to: dataDeliveryOrder.Email,
        subject: 'Akses Kode Tracking Logistik',
        html: `Kode akses anda untuk pemesanan dengan nomor order <b>${sendEmailDto.OrderNo}</b> adalah <br> <b>${Access}</b><br>Masukkan nomor untuk mengakses data. Harap jangan bagikan ke pihak lain.`,
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
        email: dataDeliveryOrder.Email,
      };
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }

  async sendMessageBaileys(sendAccessCodeWA: SendAccessWADto) {
    try {
      const dataDeliveryOrder = await this.findDataByDeliveryOrder(
        sendAccessCodeWA.OrderNo,
      );

      if (!dataDeliveryOrder) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No data found',
        };
      }

      const accessCode = dataDeliveryOrder.CustomerId.slice(-4);

      const phoneNumber = '62' + dataDeliveryOrder.Phone.slice(1);
      await this.baileysService.sock.sendMessage(
        `${phoneNumber}@s.whatsapp.net`,
        {
          text: `Kode Akses Anda : *${accessCode}*, Silahkan gunakan untuk mengakses rincian informasi mengenai orderan Anda dengan no : *${dataDeliveryOrder.OrderNo}*`,
        },
      );
      return {
        status: HttpStatus.OK,
        message: 'Kode Akses Berhasil Di kirim',
      };
    } catch (error) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    }
  }
}
