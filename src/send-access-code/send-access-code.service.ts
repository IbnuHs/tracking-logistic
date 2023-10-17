import { Injectable } from '@nestjs/common';
import { CreateSendAccessCodeDto } from './dto/create-send-access-code.dto';
import * as nodemailer from 'nodemailer';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from 'src/tracking-logistic/Entities/customer.entity';
import { TrackingLogisticService } from 'src/tracking-logistic/tracking-logistic.service';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Client, LocalAuth, Chat } from 'whatsapp-web.js';
import * as qrcode from 'qrcode-terminal';
import { Response } from 'express';
import { SendAccessEmailDto } from './dto/sendAccessCodeEmail.dto copy';
import { SendAccessWADto } from './dto/sendAccessCodeWA.dto';
import * as Twilio from 'twilio';
import { WhatsappBaileysService } from './baileys.service';
import { DisconnectReason } from '@whiskeysockets/baileys/lib/Types';
import {
  fetchLatestBaileysVersion,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys/lib/Utils';
import makeWASocket from '@whiskeysockets/baileys/lib/Socket';
import { isJidBroadcast } from '@whiskeysockets/baileys/lib/WABinary';
import { Boom } from '@hapi/boom';
import { OnApplicationBootstrap } from '@nestjs/common/interfaces';

let client: Client;
let ready = false;
let allSessionObject = {};
let data = {};

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
    let res: Response;
    await this.baileysService.connectWhatsapp();
  }

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
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS,
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
          message: err.message,
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
      sendEmailDto.OrderNo,
    );

    // if (sendEmailDto.email !== dataDeliveryOrder.customer.Email) {
    //   throw new BadRequestException('Email bukan yang terdaftar di sistem.');
    // }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'logistictesting33@gmail.com',
        pass: 'rwfm ykqo dohs lbxy',
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

  async sendViaWhatsapp(sendWADto: SendAccessWADto, res: Response) {
    const dataDeliveryOrder = await this.findDataByDeliveryOrder(
      sendWADto.OrderNo,
    );

    // if (sendWADto.phone !== dataDeliveryOrder.customer.Phone) {
    //   throw new BadRequestException('Nomor HP bukan yang terdaftar di sistem.');
    // }

    if (!allSessionObject['client']) {
      // await this.generateWhatsapp(res);
      return res.json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Session belum dibuat. Generate Whatsapp terlebih dahulu',
      });
    }
    let phoneNumber = dataDeliveryOrder.customer.Phone.slice(1);

    phoneNumber = '62' + phoneNumber + '@c.us';
    if (ready) {
      try {
        await client.sendMessage(
          phoneNumber,
          `Kode akses anda untuk pemesanan dengan nomor order *${dataDeliveryOrder.OrderNo}* adalah *${dataDeliveryOrder.Access}*. Masukkan nomor untuk mengakses data. Harap jangan bagikan ke pihak lain.`,
        );
      } catch (err) {
        return res.json({
          message: err.message,
        });
      }

      return res.json({
        statusCode: HttpStatus.OK,
        session: 'client',
        message: `Kode akses terkirim`,
        number: dataDeliveryOrder.customer.Phone,
      });
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Whatsapp session not created! Please generate whatsapp first',
    };
  }

  async sendViaWhatsappTwilio() {
    const accountSid = 'AC98e45ec211ecbfdfebc5244b5017c0df';
    const authToken = 'febe2476e8811bf4c1f6c4bb7657b012';
    const twilioClient = Twilio(accountSid, authToken);

    twilioClient.messages
      .create({
        from: 'whatsapp:+14155238886',
        body: 'haloo from twilio',
        to: 'whatsapp:+6282190579766',
      })
      .then((message) => console.log(message.sid));
  }

  async sendViaWhatsappBaileys(sendWADto: SendAccessWADto, res: Response) {
    // return res.json({ tes: 'hai' });
    try {
      const { state, saveCreds } =
        await useMultiFileAuthState('baileys_auth_info');
      const { version, isLatest } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        version,
        shouldIgnoreJid: (jid) => isJidBroadcast(jid),
      });

      sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        if (qr) {
          data['qr'] = qr;
        }
        // console.log(connection);
        if (connection === 'open') {
          console.log('connected');
          // res.json({ message: 'connected' });
          // await sendMessage;
          sock.sendMessage('6281342090439@s.whatsapp.net', {
            text: 'tes',
          });
        } else if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect.error as Boom)?.output?.statusCode !==
            DisconnectReason.loggedOut;
          console.log(
            'connection closed due to ',
            lastDisconnect.error,
            ', reconnecting ',
            shouldReconnect,
          );

          if (shouldReconnect) {
            this.baileysService.connectWhatsapp();
          }
        }
      });
      sock.ev.on('creds.update', saveCreds);

      return res.json({ data, pesan: 'dikirim' });
    } catch (error) {
      return error.message;
    }
  }
  //==============================================

  async generateWhatsapp(res: Response) {
    console.log(allSessionObject['client']);
    if (ready === true && allSessionObject['client']) {
      console.log('client connected');
      data['client_ready'] = true;
      return res.json({ data });
    } else {
      try {
        client = new Client({
          puppeteer: {
            // headless: false,
            args: ['--no-sandbox'],
          },
          authStrategy: new LocalAuth({
            clientId: 'client',
          }),
        });

        client.setMaxListeners(1).on('qr', (qr) => {
          console.log('qr received!', qr);
          ready = false;
          qrcode.generate(qr, { small: true });
          data['qr'] = qr;
          data['message'] =
            'Session whatsapp tidak tersedia. scan qr terlebih dahulu.';

          // if (!ready) {
          //   return res.json({ data });
          // }
        });
        client.on('authenticated', () => {
          console.log('AUTHENTICATED');
        });
        client.on('ready', () => {
          console.log('client is ready!');
          // delete data['qr'];
          ready = true;
          allSessionObject['client'] = client;
          console.log(allSessionObject['client']);

          // if (!data['qr']) {
          //   return res.json({
          //     statusCode: HttpStatus.OK,
          //     message: 'Whatsapp ready! Kirim pesan kembali',
          //   });
          // }
        });

        // const chat = Chat

        client.on('disconnected', async () => {
          let res: Response;
          console.log('disconnected');
          allSessionObject = {};
          data = {};

          // client = new Client({
          //   puppeteer: {
          //     // headless: false,
          //     args: ['--no-sandbox'],
          //   },
          //   authStrategy: new LocalAuth({
          //     clientId: 'client',
          //   }),
          // });

          // client.setMaxListeners(1).on('qr', (qr) => {
          //   console.log('qr received!', qr);
          //   ready = false;
          //   qrcode.generate(qr, { small: true });
          //   data['qr'] = qr;
          //   data['message'] =
          //     'Session whatsapp tidak tersedia. scan qr terlebih dahulu.';

          //   // if (!ready) {
          //   //   return res.json({ data });
          //   // }
          // });
          // client.on('authenticated', () => {
          //   console.log('AUTHENTICATED');
          // });
          // client.on('ready', () => {
          //   console.log('client is ready!');
          //   // delete data['qr'];
          //   ready = true;
          //   allSessionObject['client'] = client;
          //   console.log(allSessionObject['client']);

          //   // if (!data['qr']) {
          //   //   return res.json({
          //   //     statusCode: HttpStatus.OK,
          //   //     message: 'Whatsapp ready! Kirim pesan kembali',
          //   //   });
          //   // }
          // });

          this.generateWhatsapp(res);
          // return;
        });

        // client.on('message', (msg) => {
        //   console.log(msg);
        // });

        client.initialize();
        console.log(data['qr']);
        if (data['qr']) {
          qrcode.generate(data['qr'], { small: true });
          if (!ready) {
            return res.json({ data });
          }
        }
        console.log('list:' + client.getMaxListeners());
        return res.json({ data });
      } catch (err) {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: err.message,
        };
      }
    }
  }

  async sendWhatsapp(
    phone: string,
    accessCode: string,
    deliveryOrderNum: string,
    res: Response,
  ) {
    try {
      if (!allSessionObject['client']) {
        return res.json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Layanan Whatsapp tidak tersedia. Mohon menghubungi admin.',
        });
      }
      const phoneNumber = '62' + phone.slice(1) + '@c.us';
      if (ready) {
        await client.sendMessage(
          phoneNumber,
          `Kode akses anda untuk pemesanan dengan nomor order <b>${deliveryOrderNum}</b> adalah <br> <b>${accessCode}</b><br>Masukkan nomor untuk mengakses data. Harap jangan bagikan ke pihak lain.`,
        );

        return res.json({
          statusCode: HttpStatus.OK,
          session: 'client',
          message: `Kode akses terkirim`,
          number: phone,
        });
      }
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }
}
