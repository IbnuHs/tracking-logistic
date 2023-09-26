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
import { Client, LocalAuth, RemoteAuth } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { Response } from 'express';
import { SendAccessEmailDto } from './dto/sendAccessCodeEmail.dto copy';
import { SendAccessWADto } from './dto/sendAccessCodeWA.dto';

let client: Client;
let ready = false;
let allSessionObject = {};
const data = {};

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

        this.sendEmail(user.customer.Email, user.Access, user.OrderNo);
        return Res.json({
          statusCode: HttpStatus.OK,
          message: 'Email untuk kode akses terkirim!',
        });
      } else if (validatePhone) {
        if (user.customer.Phone !== createSendAccessCodeDto.contact) {
          throw new BadRequestException('Nomor input tidak terdaftar');
        }
        return this.sendWhatsapp(
          user.customer.Phone,
          user.Access,
          user.OrderNo,
          Res,
        );
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

  async sendEmail(email: string, access: string, deliveryOrderNum: string) {
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
      html: `Kode akses anda untuk pemesanan dengan nomor order <b>${deliveryOrderNum}</b> adalah <br> <b>${access}</b><br>Masukkan nomor untuk mengakses data. Harap jangan bagikan ke pihak lain.`,
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

  //=====================MENYUSAHKAN FE========================
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
      sendEmailDto.orderNo,
    );

    if (sendEmailDto.email !== dataDeliveryOrder.customer.Email) {
      throw new BadRequestException('Email bukan yang terdaftar di sistem.');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'logistictesting33@gmail.com',
        pass: 'rwfm ykqo dohs lbxy',
      },
    });

    const mailOptions = {
      from: 'logistictesting33@gmail.com',
      to: sendEmailDto.email,
      subject: 'Akses Kode Tracking Logistik',
      html: `Kode akses anda untuk pemesanan dengan nomor order <b>${sendEmailDto.orderNo}</b> adalah <br> <b>${dataDeliveryOrder.Access}</b><br>Masukkan nomor untuk mengakses data. Harap jangan bagikan ke pihak lain.`,
    };

    const sendMail = transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err,
        };
      }
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Email untuk kode akses terkirim!',
    };
  }

  async sendViaWhatsapp(sendWADto: SendAccessWADto, res: Response) {
    const dataDeliveryOrder = await this.findDataByDeliveryOrder(
      sendWADto.orderNo,
    );

    if (sendWADto.phone !== dataDeliveryOrder.customer.Phone) {
      throw new BadRequestException('Nomor HP bukan yang terdaftar di sistem.');
    }

    if (!allSessionObject['client']) {
      return res.json({
        message: 'session not creates yet',
      });
    }
    const phoneNumber = '62' + sendWADto.phone.slice(1) + '@c.us';
    if (ready) {
      try {
        await client.sendMessage(
          phoneNumber,
          'Kode akses anda: ' + dataDeliveryOrder.Access,
        );
      } catch (err) {
        return res.json({
          message: err.message,
        });
      }

      return res.json({
        session: 'client',
        message: `Kode akses anda untuk pemesanan dengan nomor order <b>${sendWADto.orderNo}</b> adalah <br> <b>${dataDeliveryOrder.Access}</b><br>Masukkan nomor untuk mengakses data. Harap jangan bagikan ke pihak lain.`,
        number: dataDeliveryOrder.customer.Phone,
      });
    }

    return {
      message: 'Whatsapp session not created!',
    };
  }
  //==============================================

  async generateWhatsapp(res: Response) {
    console.log(allSessionObject['client']);
    if (ready === true && allSessionObject['client']) {
      console.log('client connected');
      data['client_ready'] = true;
      return res.json({ data });
    } else {
      client = new Client({
        puppeteer: {
          // headless: false,
          args: ['--no-sandbox'],
        },
        authStrategy: new LocalAuth({
          clientId: 'client',
        }),
      });
    }

    try {
      client
        .setMaxListeners(1)
        .on('qr', (qr) => {
          console.log('qr received!', qr);
          ready = false;
          qrcode.generate(qr, { small: true });
          data['qr'] = qr;
          return res.json({ data });
        })
        .once('authenticated', () => {
          console.log('AUTHENTICATED');
        })
        .once('ready', () => {
          if (!data['qr']) {
            return res.json({
              message: 'Whatsapp ready!',
            });
          }
          console.log('client is ready!');
          delete data['qr'];
          ready = true;
          allSessionObject['client'] = client;
          console.log(allSessionObject['client']);
        })
        .initialize();

      client.on('disconnected', () => {
        console.log('disconnected');
        allSessionObject = {};
        return;
      });

      console.log(data['qr']);
      if (data['qr']) {
        qrcode.generate(data['qr'], { small: true });
        return res.json({ data });
      }
      console.log('list:' + client.getMaxListeners());

      // return res.json({ data });
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }

  async sendWhatsapp(
    phone: string,
    accessCode: string,
    deliveryOrderNum: string,
    res: Response,
  ) {
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
        message: `Kode akses anda untuk pemesanan dengan nomor order <b>${deliveryOrderNum}</b> adalah <br> <b>${accessCode}</b><br>Masukkan nomor untuk mengakses data. Harap jangan bagikan ke pihak lain.`,
        number: phone,
      });
    }

    return {
      message: 'Whatsapp session not created!',
    };
  }
}
