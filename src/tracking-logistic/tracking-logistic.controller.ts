import { Controller, Get, Body } from '@nestjs/common';
import { DeliveryOrderDto } from './dto/delivery-tracking.dto';
import { TrackingLogisticService } from './tracking-logistic.service';

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
}
