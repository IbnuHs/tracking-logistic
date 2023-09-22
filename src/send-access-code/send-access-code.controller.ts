import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { SendAccessCodeService } from './send-access-code.service';
import { CreateSendAccessCodeDto } from './dto/create-send-access-code.dto';
import { UpdateSendAccessCodeDto } from './dto/update-send-access-code.dto';

@Controller('send-access-code')
export class SendAccessCodeController {
  constructor(private readonly sendAccessCodeService: SendAccessCodeService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createSendAccessCodeDto: CreateSendAccessCodeDto) {
    return this.sendAccessCodeService.sendAccessCode(createSendAccessCodeDto);
  }
}
