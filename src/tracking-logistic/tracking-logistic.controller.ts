import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Post,
} from '@nestjs/common';
import { DeliveryOrderDto } from './dto/delivery-tracking.dto';
import { TrackingLogisticService } from './tracking-logistic.service';
import { TrackingAndShipmentDto } from './dto/trackingAndShipment-dto';

@Controller('tracking-logistic')
export class TrackingLogisticController {
  constructor(
    private readonly trackingLogisticService: TrackingLogisticService,
  ) {}

  @UsePipes(new ValidationPipe())
  @Get(':orderNo')
  getDataDeliveryOrder(@Param('orderNo') orderNo: string) {
    return this.trackingLogisticService.getDeliveryOrderByOrderNo(orderNo);
  }

  @Post('trackingAndShipment')
  trackingOrder(@Body() trackingAndShipmentDto: TrackingAndShipmentDto) {
    return this.trackingLogisticService.TrackingAndShipmentinfo(
      trackingAndShipmentDto,
    );
  }
}
