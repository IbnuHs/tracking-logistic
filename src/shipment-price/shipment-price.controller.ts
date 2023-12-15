import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CheckPriceDto } from './dto/check-price.dto';
import { ShipmentPriceService } from './shipment-price.service';

@Controller('shipment-price')
export class ShipmentPriceController {
  constructor(private readonly shipmentPriceService: ShipmentPriceService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  getShipmentPrice(@Body() checkPrice: CheckPriceDto) {
    return this.shipmentPriceService.getPrice(checkPrice);
  }

  @Get()
  getAll() {
    return this.shipmentPriceService.getAll();
  }
}
