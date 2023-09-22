import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryOrderDto } from './dto/delivery-tracking.dto';
import { Customer } from './Entities/customer.entity';
import { DeliveryOrder } from './Entities/delivery-order.entity';

@Injectable()
export class TrackingLogisticService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
  ) {}

  async getDeliveryOrderByOrderNo(deliveryOrderDto: DeliveryOrderDto) {
    const dataDeliveryOrder = await this.deliveryOrderRepository.findOne({
      where: {
        OrderNo: deliveryOrderDto.orderNo,
      },
      relations: {
        customer: true,
      },
    });

    if (!dataDeliveryOrder) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Data Delivery Order tidak ditemukan.',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Data Order Detail ditemukan!',
      data: {
        orderNo: dataDeliveryOrder.OrderNo,
        customerId: dataDeliveryOrder.customer.CustomerId,
        customerName: dataDeliveryOrder.customer.Customer,
        customerAddress: dataDeliveryOrder.customer.Address,
        receiverName: dataDeliveryOrder.Receiver,
        receiverAddress: dataDeliveryOrder.ReceiverAddress,
      },
    };
  }
}
