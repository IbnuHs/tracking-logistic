import { Body, Controller, Get } from '@nestjs/common';
import { DeliveryOrderTrackingService } from './delivery-order-tracking.service';
import { trackingDto } from './dto/delivery-order-tracking-dto';

@Controller('tracking')
export class DeliveryOrderTrackingController {
  constructor(private readonly trackingService: DeliveryOrderTrackingService) {}

  @Get()
  tracking(@Body() orderNo: trackingDto) {
    return this.trackingService.getOrderTracking(orderNo);
  }
}
