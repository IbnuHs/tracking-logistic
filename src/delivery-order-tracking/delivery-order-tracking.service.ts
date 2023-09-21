import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryOrderTracking } from './entity/delivery-order-app.entity';
import { Repository } from 'typeorm';
import { trackingDto } from './dto/delivery-order-tracking-dto';

@Injectable()
export class DeliveryOrderTrackingService {
  constructor(
    @InjectRepository(DeliveryOrderTracking)
    private readonly deliveryOrderTrackingRepository: Repository<DeliveryOrderTracking>,
  ) {}

  //Controller
  async getOrderTracking(OrderNo: trackingDto): Promise<object> {
    const order = OrderNo.OrderNo;
    const data = await this.deliveryOrderTrackingRepository.find({
      where: {
        OrderNo: order,
      },
    });
    if (!data || data.length === 0)
      throw new NotFoundException('Invalid order Number');

    return data;
  }
}
