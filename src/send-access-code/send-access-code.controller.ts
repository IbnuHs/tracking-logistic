import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SendAccessCodeService } from './send-access-code.service';
import { CreateSendAccessCodeDto } from './dto/create-send-access-code.dto';
import { UpdateSendAccessCodeDto } from './dto/update-send-access-code.dto';

@Controller('send-access-code')
export class SendAccessCodeController {
  constructor(private readonly sendAccessCodeService: SendAccessCodeService) {}

  @Post()
  create(@Body() createSendAccessCodeDto: CreateSendAccessCodeDto) {
    return this.sendAccessCodeService.create(createSendAccessCodeDto);
  }

  @Get()
  findAll() {
    return this.sendAccessCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sendAccessCodeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSendAccessCodeDto: UpdateSendAccessCodeDto) {
    return this.sendAccessCodeService.update(+id, updateSendAccessCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sendAccessCodeService.remove(+id);
  }
}
