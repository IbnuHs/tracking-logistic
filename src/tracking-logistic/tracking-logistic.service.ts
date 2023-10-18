import {
  Injectable,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryOrderDto } from './dto/delivery-tracking.dto';
import { Customer } from './Entities/customer.entity';
import { DeliveryOrder } from './Entities/delivery-order.entity';
import { DeliveryOrderTracking } from './Entities/delivery-order-app.entity';
import { TrackingAndShipmentDto } from './dto/trackingAndShipment-dto';

@Injectable()
export class TrackingLogisticService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,

    @InjectRepository(DeliveryOrderTracking)
    private readonly trackingRepository: Repository<DeliveryOrderTracking>,
  ) {}

  async getDeliveryOrderByOrderNo(OrderNo: string) {
    const dataDeliveryOrder = await this.deliveryOrderRepository.findOne({
      where: {
        OrderNo: OrderNo,
      },
      relations: {
        customer: true,
      },
    });

    if (!dataDeliveryOrder)
      throw new NotFoundException('Data Delivery Tidak Ditemukan');
    const email = dataDeliveryOrder.customer.Email;
    const [userName, domain] = email.split('@');
    const maskedEmail =
      userName.charAt(0) + '*'.repeat(userName.length - 1) + '@' + domain;
    // console.log(maskedUser);
    const phoneNumber = dataDeliveryOrder.customer.Phone;
    const maskedPhoneNumber =
      phoneNumber.slice(0, 3) + '*****' + phoneNumber.slice(-3);

    return {
      statusCode: HttpStatus.OK,
      message: 'Data Order Detail ditemukan!',
      data: {
        OrderNo: dataDeliveryOrder.OrderNo,
        customerId: dataDeliveryOrder.customer.CustomerId,
        customerName: dataDeliveryOrder.customer.Customer,
        customerAddress: dataDeliveryOrder.customer.Address,
        receiverName: dataDeliveryOrder.Receiver,
        receiverAddress: dataDeliveryOrder.ReceiverAddress,
        email: maskedEmail,
        phone: maskedPhoneNumber,
      },
    };
  }

  // Handler Get Tracking Info and Shipment Info
  async TrackingAndShipmentinfo(
    trackingDto: TrackingAndShipmentDto,
  ): Promise<object> {
    // Shipment Informaton
    const { OrderNo, Access } = trackingDto;
    const dataDeliveryOrder = await this.deliveryOrderRepository.findOne({
      where: {
        OrderNo: OrderNo,
      },
      relations: {
        // customer: true,
        tracking: true,
      },
    });
    // Checking Access Code
    if (dataDeliveryOrder.Access !== Access)
      throw new UnauthorizedException('Kode Akses Anda Salah');

    // Sorting Status Tracking
    dataDeliveryOrder.tracking.sort((a, b) => {
      return new Date(a.Datetime).getTime() - new Date(b.Datetime).getTime();
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'Data Order Detail ditemukan!',
      Shipment_Info: {
        Services: dataDeliveryOrder.Services,
        Via: dataDeliveryOrder.Via,
        TypeOfHandling: dataDeliveryOrder.TypeOfHandling,
        TypeOfRate: dataDeliveryOrder.TypeOfRate,
        OriginDestination: dataDeliveryOrder.Orides,
      },
      Tracking: dataDeliveryOrder.tracking,
    };
  }
}
// console.log(Access);
// if (!dataDeliveryOrder)
//   throw new NotFoundException('Data Delivery Tidak Ditemukan');
// if (dataDeliveryOrder.Access !== Access)
//   throw new UnauthorizedException('Access Code Denied');

// // Get Tracking
// const Tracking_Status = await this.trackingRepository.find({
//   where: {
//     OrderNo: trackingDto.OrderNo,
//   },
// });

// if (!Tracking_Status || Tracking_Status.length === 0)
//   throw new NotFoundException('Order Not Found');

// Tracking_Status.sort((a, b) => {
//   return new Date(a.Datetime).getTime() - new Date(b.Datetime).getTime();
// });

// console.log(new Date(Tracking_Status[0].Datetime));

// return {
//   statusCode: HttpStatus.OK,
//   message: 'Data Order Detail ditemukan!',
//   Shipment_Info: {
// Services: dataDeliveryOrder.Services,
// Via: dataDeliveryOrder.Via,
// TypeOfHandling: dataDeliveryOrder.TypeOfHandling,
// TypeOfRate: dataDeliveryOrder.TypeOfRate,
// OriginDestination: dataDeliveryOrder.Orides,
//   },
//   Tracking_Status,
// };
