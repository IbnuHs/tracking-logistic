import { Injectable } from '@nestjs/common';
import { CreateSendAccessCodeDto } from './dto/create-send-access-code.dto';
import { UpdateSendAccessCodeDto } from './dto/update-send-access-code.dto';
import * as nodemailer from 'nodemailer';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/tracking-logistic/Entities/customer.entity';
import { TrackingLogisticService } from 'src/tracking-logistic/tracking-logistic.service';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Client, LocalAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { Response } from 'express';

const client = new Client({
  puppeteer: {
    // headless: false,
    args: ['--no-sandbox'],
  },
  authStrategy: new LocalAuth({
    clientId: 'client',
  }),
});
const allSessionObject = {};
let ready = false;

@Injectable()
export class SendAccessCodeService {
  constructor(
    private trackingLogisticService: TrackingLogisticService,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
  ) {}

  async sendAccessCode(
    createSendAccessCodeDto: CreateSendAccessCodeDto,
    Res: Response,
  ) {
    try {
      const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const validateEmail = emailRegex.test(createSendAccessCodeDto.contact);

      const phoneRegex = /^\d+$/;
      const validatePhone = phoneRegex.test(createSendAccessCodeDto.contact);

      const user = await this.deliveryOrderRepository.findOne({
        where: {
          OrderNo: createSendAccessCodeDto.orderNo,
        },
        relations: {
          customer: true,
        },
      });

      if (!user) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Order tidak ditemukan',
        };
      }

      if (validateEmail) {
        if (user.customer.Email !== createSendAccessCodeDto.contact) {
          throw new BadRequestException('Email input tidak terdaftar');
        }

        this.sendEmail(user.customer.Email, user.Access);
        return {
          statusCode: HttpStatus.OK,
          message: 'Email untuk kode akses terkirim!',
        };
      } else if (validatePhone) {
        if (user.customer.Phone !== createSendAccessCodeDto.contact) {
          throw new BadRequestException('Nomor input tidak terdaftar');
        }
        return this.sendWhatsapp(user.customer.Phone, user.Access, Res);
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Data ditemukan',
        data: user,
      };
    } catch (err) {
      throw err;
    }
  }

  async sendEmail(email: string, access: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'logistictesting33@gmail.com',
        pass: 'rwfm ykqo dohs lbxy',
      },
    });

    const mailOptions = {
      from: 'logistictesting33@gmail.com',
      to: email,
      subject: 'Akses Kode Tracking Logistik',
      html: `Kode akses anda <b>${access}</b><br>Harap jangan bagikan ke pihak lain.`,
    };

    const sendMail = transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err,
        };
      }
      return {
        statusCode: HttpStatus.OK,
        response: info.response,
        message: 'Email untuk kode akses terkirim!',
      };
    });

    console.log(sendMail);
  }

  async generateWhatsapp(res: Response) {
    const data = {};
    if (allSessionObject['client']) {
      console.log('client connected');
      data['client_ready'] = true;
      return res.json({ data });
    }
    try {
      client
        .once('qr', (qr) => {
          allSessionObject['client'] = null;
          console.log('qr received!', qr);
          qrcode.generate(qr, { small: true });
          data['qr'] = qr;
          return res.json({ data });
        })
        .once('authenticated', () => {
          console.log('AUTHENTICATED');
        })
        .once('auth_failure', () => {
          allSessionObject['client'] = null;
          console.log('failed');
          return res.json({ data });
        })
        .once('disconnected', () => {
          return res.json({
            message: 'Whatsapp disconnected',
          });
        })
        .once('ready', () => {
          console.log('client is ready!');
          ready = true;
          allSessionObject['client'] = client;
          // console.log(allSessionObject['client']);
          // if (allSessionObject['client']) {
          //   data['client_ready'] = true;
          // return res.json({ data });
          // }
          // console.log(allSessionObject['client']);
        })
        .initialize();

      // return res.json({ data });
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }

  async sendWhatsapp(phone: string, accessCode: string, res: Response) {
    if (!allSessionObject['client']) {
      return res.json({
        message: 'session not creates yet',
      });
    }
    const phoneNumber = '62' + phone.slice(1) + '@c.us';
    if (ready) {
      await client.sendMessage(phoneNumber, 'Kode akses anda: ' + accessCode);

      return res.json({
        session: 'client',
        message: `Sent! Access code: ` + accessCode,
        number: phone,
      });
    }

    return {
      message: 'Whatsapp session not created!',
    };
  }
}
