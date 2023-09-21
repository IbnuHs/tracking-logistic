import { Injectable, Inject } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/entity/customer.entity';
import { createQueryBuilder, Repository } from 'typeorm';
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
    });

    // const customer = this.DeliveryOrderRepository.createQueryBuilder('customer','c')
    //   .innerJoinAndSelect('c.order')
    //   .getMany();

    // console.log(await customer);

    const dataCustomer = await this.customerService.getCustomer(
      dataDeliveryOrder.CustomerId,
    );

    console.log(dataDeliveryOrder.customerData);

    if (!dataDeliveryOrder) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Data Delivery Order tidak ditemukan.',
      };
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Data Delivery Order ditemukan!',
      data: {
        dataDeliveryOrder: { ...dataDeliveryOrder, dataCustomer: dataCustomer },
      },
    };
  }
}
