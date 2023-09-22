import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/customer/customer.service';
import { Repository } from 'typeorm';
import { FindOrderDto } from './dto/deliveryOrder.dto';
import { DeliveryOrder } from './entity/delivery-order.entity';

@Injectable()
export class DeliveryOrderService {
  constructor(
    @InjectRepository(DeliveryOrder)
    private readonly DeliveryOrderRepository: Repository<DeliveryOrder>,

    private readonly customerService: CustomerService,
  ) {}

  async getDeliveryOrderByOrderNo(orderDto: FindOrderDto) {
    const dataDeliveryOrder = await this.DeliveryOrderRepository.findOne({
      where: {
        OrderNo: orderDto.OrderId,
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
