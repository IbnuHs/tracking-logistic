import { Injectable } from '@nestjs/common';
import { useMultiFileAuthState } from '@whiskeysockets/baileys';
import makeWASocket from '@whiskeysockets/baileys/lib/Socket';
import { DisconnectReason } from '@whiskeysockets/baileys/lib/Types';
import { fetchLatestBaileysVersion } from '@whiskeysockets/baileys/lib/Utils';
import { SendAccessWADto } from './dto/sendAccessCodeWA.dto';
import { isJidBroadcast } from '@whiskeysockets/baileys/lib/WABinary';

@Injectable()
export class WhatsappBaileysService {
  public sock;
  public qrCode;

  async onAppBootstrap() {
    console.log('Running connecte Whatsapp on server start');
    await this.connectWhatsapp();
  }

  async connectWhatsapp() {
    try {
      const { state, saveCreds } =
        await useMultiFileAuthState('baileys_auth_info');
      const { version, isLatest } = await fetchLatestBaileysVersion();

      this.sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        version,
        shouldIgnoreJid: (jid) => isJidBroadcast(jid),
      });
      // store.bind(sock.ev);
      // sock.multi = true;
    } catch (error) {
      return error.message;
    }
  }

  async initWhatsapp(authState?: any, saveCreds?: any) {
    try {
      this.sock = makeWASocket({
        printQRInTerminal: true,
        auth: authState,
        shouldIgnoreJid: (jid) => isJidBroadcast(jid),
      });

      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === 'open') {
          console.log('connection open');
        }
        if (connection === 'close') {
          const shouldReconnect =
            lastDisconnect.error?.output?.statusCode !==
            DisconnectReason.loggedOut;

          console.log(
            'connection closed due to ',
            lastDisconnect.error,
            ', reconnecting ',
            shouldReconnect,
          );

          if (shouldReconnect) {
            if (saveCreds) {
              await saveCreds(this.sock.authstate);
            }
          }
          if (qr) {
            this.qrCode = qr;
          }
          console.log(this.qrCode);
        }
      });
    } catch (error) {
      return error.message;
    }
  }
}
