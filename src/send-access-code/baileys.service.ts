import { HttpStatus, Injectable } from '@nestjs/common';
import {
  makeInMemoryStore,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys';
import makeWASocket from '@whiskeysockets/baileys/lib/Socket';
import { DisconnectReason } from '@whiskeysockets/baileys/lib/Types';
import {
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from '@whiskeysockets/baileys/lib/Utils';
import * as QRCode from 'qrcode';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { SendAccessWADto } from './dto/sendAccessCodeWA.dto';
const pino = require('pino');
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';

@Injectable()
export class WhatsappBaileysService {
  constructor(
    private readonly mailService: MailerService,
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
  ) {}
  public sock: any;
  public qrCode: any;
  private store: any;

  async initWhatsapp() {
    console.log('init whatsapp');
    const P = pino({
      level: 'silent',
    });
    const { state, saveCreds } =
      await useMultiFileAuthState('baileys_auth_info');
    const { version, isLatest } = await fetchLatestBaileysVersion();
    try {
      this.sock = makeWASocket({
        printQRInTerminal: false,
        version,
        logger: P,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, P),
        },
        // shouldIgnoreJid: (jid) => isJidBroadcast(jid),
      });
      makeInMemoryStore.bind(this.sock.ev);
      this.sock.ev.on('creds.update', saveCreds);
      this.sock.ev.process(async (events) => {
        if (events['connection.update']) {
          console.log('update');
          const update = events['connection.update'];
          const { connection, lastDisconnect, qr } = update;

          if (connection === 'open') {
            console.log('connection open');
            console.log('WHATSAAPP SIAP DI GUNAKAN');
          }
          if (connection === 'close') {
            if (
              lastDisconnect &&
              lastDisconnect.error &&
              lastDisconnect.error.output &&
              lastDisconnect.error.output.statusCode !==
                DisconnectReason.loggedOut
            ) {
              console.log('closed connection');
              this.initWhatsapp();
            } else {
              console.log('Connection Closed. You are Logged Out.');
              try {
                fs.unlinkSync('./baileys_auth_info/creds.json');
                await this.mailService.sendMail({
                  to: 'cindybela22@gmail.com',
                  subject: 'Whatsapp Message',
                  text: 'Anda Telah Logout',
                  html: '<h1><b>Akun Whatsapp Anda Telah Logout</b></h1>',
                });
                console.log('Sesi Berhasil Di hapus');
                setTimeout(async () => {
                  await this.initWhatsapp();
                }, 10000);
              } catch (error) {
                console.log(error.message);
                return error.message;
              }
            }
          }
          if (qr) {
            // console.log(qr);
            console.log('qr Ready');
            this.qrCode = qr;
            await this.sendQr();
            // await this.generateQRCode();
          }
          // console.log(this.qrCode);
        }
      });
    } catch (error) {
      return error.message;
    }
  }
  async generateQRCode() {
    return new Promise((resolve, reject) => {
      // console.log('this qr', this.qrCode);
      if (this.qrCode) {
        // console.log('qrCode : ', this.qrCode);
        QRCode.toFile('qrCode.png', this.qrCode, (err, url) => {
          if (err) {
            console.log('Gagal generate qrCode image');
            reject('Gagal generate qrCode image');
          } else {
            console.log('Berhasil generate QR Code image');
            resolve(url);
          }
        });
      } else {
        console.log('QR code belum tersedia');
        reject('QR code belum tersedia');
      }
    });
  }

  async sendQr() {
    try {
      await this.generateQRCode();
      // console.log('tttttt');
      await this.mailService.sendMail({
        to: 'cindybela22@gmail.com',
        subject: 'Qr Code To Login',
        html: `Embedded image: <img src="cid:unique@cid"/>`,
        attachments: [
          {
            filename: 'qrCode.png',
            path: './qrCode.png',
            cid: 'qrCode',
          },
        ],
      });
      console.log('Berhasil mengirim QrCode');
      return {
        message: 'Qr Code Berhasil di kirim',
      };
    } catch (error) {
      console.log(error);
      return {
        message: error.message,
      };
    }
  }

  // SEND MESSAGE VIA WHATSAPP BAILEYS
  async sendMessageBaileys(sendAccessCodeWA: SendAccessWADto) {
    try {
      const user = await this.deliveryOrderRepository.findOne({
        where: {
          OrderNo: sendAccessCodeWA.OrderNo,
        },
      });
      const accessCode = user.CustomerId.slice(-4);
      const phoneNumber = '62' + user.Phone.slice(1);
      await this.sock.sendMessage(`${phoneNumber}@s.whatsapp.net`, {
        text: `Kode Akses Anda : *${accessCode}*, Silahkan gunakan untuk mengakses rincian informasi mengenai orderan Anda dengan no : *${user.OrderNo}*`,
      });
      return {
        status: HttpStatus.OK,
        message: 'Kode Akses Berhasil Di kirim',
      };
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
}
