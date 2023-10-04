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

  async getDeliveryOrderByOrderNo(deliveryOrderDto: DeliveryOrderDto) {
    const dataDeliveryOrder = await this.deliveryOrderRepository.findOne({
      where: {
        OrderNo: deliveryOrderDto.OrderNo,
      },
      relations: {
        customer: true,
      },
    });

    if (!dataDeliveryOrder)
      throw new NotFoundException('Data Delivery Tidak Ditemukan');

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
      },
    };
  }

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
        customer: true,
      },
    });
    console.log(Access);
    if (!dataDeliveryOrder)
      throw new NotFoundException('Data Delivery Tidak Ditemukan');
    if (dataDeliveryOrder.Access !== Access)
      throw new UnauthorizedException('Access Code Denied');

    // Get Tracking
    const Tracking_Status = await this.trackingRepository.find({
      where: {
        OrderNo: trackingDto.OrderNo,
      },
    });

    if (!Tracking_Status || Tracking_Status.length === 0)
      throw new NotFoundException('Order Not Found');

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
      Tracking_Status,
    };
  }
}
