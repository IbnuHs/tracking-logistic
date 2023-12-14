import {
  Controller,
  Get,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Post,
} from '@nestjs/common';
import { TrackingLogisticService } from './tracking-logistic.service';
import { TrackingAndShipmentDto } from './dto/trackingAndShipment-dto';
import { ApiOperation } from '@nestjs/swagger/dist/decorators/api-operation.decorator';

@Controller('tracking-logistic')
export class TrackingLogisticController {
  constructor(
    private readonly trackingLogisticService: TrackingLogisticService,
  ) {}

  @ApiOperation({
    description: 'get data by order number',
  })
  @UsePipes(new ValidationPipe())
  @Get(':orderNo')
  getDataDeliveryOrder(@Param('orderNo') orderNo: string) {
    return this.trackingLogisticService.getDeliveryOrderByOrderNo(orderNo);
  }

  @ApiOperation({
    description: 'get data detail using access code',
  })
  @UsePipes(new ValidationPipe())
  @Post('trackingAndShipment')
  trackingOrder(@Body() trackingAndShipmentDto: TrackingAndShipmentDto) {
    return this.trackingLogisticService.TrackingAndShipmentinfo(
      trackingAndShipmentDto,
    );
  }
}
