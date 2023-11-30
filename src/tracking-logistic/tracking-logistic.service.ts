import {
  Injectable,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    });

    if (!dataDeliveryOrder)
      throw new NotFoundException('Data Delivery Tidak Ditemukan');
    const email = dataDeliveryOrder.Email;
    const [userName, domain] = email.split('@');
    const maskedEmail = email
      ? userName.charAt(0) + '*'.repeat(userName.length - 1) + '@' + domain
      : null;

    const phoneNumber = dataDeliveryOrder.Phone;
    const maskedPhoneNumber = phoneNumber
      ? phoneNumber.slice(0, 3) + '*****' + phoneNumber.slice(-3)
      : null;

    return {
      statusCode: HttpStatus.OK,
      message: 'Data Order Detail ditemukan!',
      data: {
        refNumber: dataDeliveryOrder.RefNo,
        OrderNo: dataDeliveryOrder.OrderNo,
        orderDate: dataDeliveryOrder.OrderDate,
        commodity: dataDeliveryOrder.Commodity,
        remarks: dataDeliveryOrder.Remarks,
        receiverName: dataDeliveryOrder.Receiver,
        receiverAddress: dataDeliveryOrder.ReceiverAddress,
        email: maskedEmail,
        phone: maskedPhoneNumber,
      },
    };
  }

  // Handler Get Tracking Info and Shipment Info
  async TrackingAndShipmentinfo(trackingDto: TrackingAndShipmentDto) {
    // Shipment Informaton
    const { OrderNo, Access } = trackingDto;
    const dataDeliveryOrder = await this.deliveryOrderRepository.findOne({
      where: {
        OrderNo: OrderNo,
      },
      relations: {
        tracking: true,
      },
    });
    if (!dataDeliveryOrder)
      throw new NotFoundException('No Order Tidak Di Temukan');

    // console.log(dataDeliveryOrder);
    const AccesCode = dataDeliveryOrder.CustomerId.slice(-4);
    // Checking Access Code
    if (Access !== AccesCode)
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
