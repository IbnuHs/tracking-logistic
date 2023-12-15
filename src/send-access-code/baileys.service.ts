import { Injectable } from '@nestjs/common';
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
    const P = pino({
      level: 'silent',
    });
    const { state, saveCreds } =
      await useMultiFileAuthState('baileys_auth_info');
    const { version } = await fetchLatestBaileysVersion();
    try {
      this.sock = makeWASocket({
        printQRInTerminal: false,
        version,
        logger: P,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, P),
        },
      });
      makeInMemoryStore.bind(this.sock.ev);
      this.sock.ev.on('creds.update', saveCreds);
      this.sock.ev.process(async (events) => {
        if (events['connection.update']) {
          const update = events['connection.update'];
          const { connection, lastDisconnect, qr } = update;

          if (connection === 'open') {
            console.log('WHATSAPP SIAP DI GUNAKAN');
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
                  to: 'mait.merryska@gmail.com',
                  subject: 'Whatsapp Message',
                  text: 'Anda Telah Logout',
                  html: '<h1><b>Akun Whatsapp Anda Telah Logout</b></h1>',
                });
                console.log('Sesi Berhasil Di hapus');
                setTimeout(async () => {
                  await this.initWhatsapp();
                }, 10000);
              } catch (error) {
                return error.message;
              }
            }
          }
          if (qr) {
            this.qrCode = qr;
            await this.sendQr();
          }
        }
      });
    } catch (error) {
      return error.message;
    }
  }
  async generateQRCode() {
    return new Promise((resolve, reject) => {
      if (this.qrCode) {
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
      await this.mailService.sendMail({
        to: 'mait.merryska@gmail.com',
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
      return {
        message: error.message,
      };
    }
  }
}
