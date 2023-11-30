import { Controller, Post, Body } from '@nestjs/common';
import { InsertDataService } from './insert-data.service';
import { CreateInsertDatumDto } from './dto/create-insert-datum.dto';

@Controller('insert-data')
export class InsertDataController {
  constructor(private readonly insertDataService: InsertDataService) {}

  @Post()
  create(@Body() createInsertDatumDto: CreateInsertDatumDto) {
    return this.insertDataService.insertData();
  }
}
