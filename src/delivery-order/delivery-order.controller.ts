import { Controller, Get, Body } from '@nestjs/common';
import { DeliveryOrderTrackingDto } from 'src/delivery-order-tracking/dto/delivery-tracking.dto';
import { DeliveryOrderService } from './delivery-order.service';
import { FindOrderDto } from './dto/deliveryOrder.dto';

@Controller('delivery-order')
export class DeliveryOrderController {
  constructor(private readonly deliveryOrderService: DeliveryOrderService) {}
  @Get()
  getDeliveryOrder(@Body() deliveryOrderDto: FindOrderDto) {
    return this.deliveryOrderService.getDeliveryOrderByOrderNo(
      deliveryOrderDto,
    );
  }
}
