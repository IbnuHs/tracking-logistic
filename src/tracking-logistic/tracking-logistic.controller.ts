import { Controller, Get, Body } from '@nestjs/common';
import { DeliveryOrderDto } from './dto/delivery-tracking.dto';
import { TrackingLogisticService } from './tracking-logistic.service';
import { TrackingAndShipmentDto } from './dto/trackingAndShipment-dto';

@Controller('tracking-logistic')
export class TrackingLogisticController {
  constructor(
    private readonly trackingLogisticService: TrackingLogisticService,
  ) {}

  @Get()
  getDataDeliveryOrder(@Body() deliveryOrderDto: DeliveryOrderDto) {
    return this.trackingLogisticService.getDeliveryOrderByOrderNo(
      deliveryOrderDto,
    );
  }

  @Get('trackingAndShipment')
  trackingOrder(@Body() trackingAndShipmentDto: TrackingAndShipmentDto) {
    return this.trackingLogisticService.TrackingAndShipmentinfo(
      trackingAndShipmentDto,
    );
  }

  // @Get('shipmentInfo')
  // shipmentInfo(@Body() deliveryOrderDto: DeliveryOrderDto) {
  //   return this.trackingLogisticService.getShipmentInfo(deliveryOrderDto);
  // }
}
