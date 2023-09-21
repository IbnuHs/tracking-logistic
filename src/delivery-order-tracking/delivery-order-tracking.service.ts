import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryOrderTrackingDto } from './dto/delivery-tracking.dto';
import { DeliveryOrderTracking } from './entity/delivery-order-app.entity';

@Injectable()
export class DeliveryOrderTrackingService {
  constructor(
    @InjectRepository(DeliveryOrderTracking)
    private readonly deliveryOrderTracking: Repository<DeliveryOrderTracking>,
  ) {}

  async getOrderTracking(deliveryOrderTrackingDto: DeliveryOrderTrackingDto) {
    try {
      const dataOrderTracking = await this.deliveryOrderTracking.findOne({
        where: {
          OrderNo: deliveryOrderTrackingDto.orderNo,
        },
      });

      if (!dataOrderTracking) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data tidak ditemukan',
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Data ditemukan',
        data: dataOrderTracking,
      };
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }
}
