import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InsertDataService } from './insert-data.service';
import { CreateInsertDatumDto } from './dto/create-insert-datum.dto';
import { get } from 'http';

@Controller('insert-data')
export class InsertDataController {
  constructor(private readonly insertDataService: InsertDataService) {}

  @Post()
  create(@Body() createInsertDatumDto: CreateInsertDatumDto) {
    return this.insertDataService.insertData();
  }
}
