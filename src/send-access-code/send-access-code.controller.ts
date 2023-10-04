import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Res,
  UsePipes,
} from '@nestjs/common';
import { SendAccessCodeService } from './send-access-code.service';
import { CreateSendAccessCodeDto } from './dto/create-send-access-code.dto';
import { Response } from 'express';
import { SendAccessEmailDto } from './dto/sendAccessCodeEmail.dto copy';
import { SendAccessWADto } from './dto/sendAccessCodeWA.dto';

@Controller('send-access-code')
export class SendAccessCodeController {
  constructor(private readonly sendAccessCodeService: SendAccessCodeService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(
    @Body() createSendAccessCodeDto: CreateSendAccessCodeDto,
    @Res() res: Response,
  ) {
    return this.sendAccessCodeService.sendAccessCode(
      createSendAccessCodeDto,
      res,
    );
  }

  @Get('generate-whatsapp')
  generateWhatsapp(@Res() res: Response) {
    return this.sendAccessCodeService.generateWhatsapp(res);
  }

  @UsePipes(new ValidationPipe())
  @Post('/email')
  sendEmail(@Body() sendEmailDto: SendAccessEmailDto) {
    return this.sendAccessCodeService.sendViaEmail(sendEmailDto);
  }

  @UsePipes(new ValidationPipe())
  @Post('/whatsapp')
  sendWhatsapp(@Body() sendWADto: SendAccessWADto, @Res() res: Response) {
    return this.sendAccessCodeService.sendViaWhatsapp(sendWADto, res);
  }

  @Post('/whatsappTwilio')
  sendWhatsappTwilio(@Body() sendWADto: SendAccessWADto) {
    return this.sendAccessCodeService.sendViaWhatsappTwilio();
  }
}
