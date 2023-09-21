import { Controller, Get, Body } from '@nestjs/common';
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
