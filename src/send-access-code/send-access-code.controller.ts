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
import { ApiOperation } from '@nestjs/swagger/dist';

@Controller('send-access-code')
export class SendAccessCodeController {
  constructor(
    private readonly sendAccessCodeService: SendAccessCodeService,
    private readonly baileyService: WhatsappBaileysService,
  ) {}

  @ApiOperation({
    description: 'send WhatsApp message to customer related to access code',
  })
  @UsePipes(new ValidationPipe())
  @Post('/email')
  sendEmail(@Body() sendEmailDto: SendAccessEmailDto) {
    return this.sendAccessCodeService.sendViaEmail(sendEmailDto);
  }

  @ApiOperation({
    description: 'send Email message to customer related to access code',
  })
  @UsePipes(new ValidationPipe())
  @Post('/whatsapp')
  sendWABaileys(@Body() sendWADto: SendAccessWADto) {
    return this.sendAccessCodeService.sendMessageBaileys(sendWADto);
  }
}
