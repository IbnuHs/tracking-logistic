import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { SendAccessCodeService } from './send-access-code.service';
import { SendAccessEmailDto } from './dto/sendAccessCodeEmail.dto copy';
import { SendAccessWADto } from './dto/sendAccessCodeWA.dto';
import { WhatsappBaileysService } from './baileys.service';

@Controller('send-access-code')
export class SendAccessCodeController {
  constructor(
    private readonly sendAccessCodeService: SendAccessCodeService,
    private readonly baileyService: WhatsappBaileysService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Post('/email')
  sendEmail(@Body() sendEmailDto: SendAccessEmailDto) {
    return this.sendAccessCodeService.sendViaEmail(sendEmailDto);
  }

  @Post('/whatsapp-baileys')
  sendWABaileys(@Body() sendWADto: SendAccessWADto) {
    return this.baileyService.sendMessageBaileys(sendWADto);
  }
}
