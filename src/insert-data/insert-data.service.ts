import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { api } from './Api/api';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { DeliveryOrderTracking } from 'src/tracking-logistic/Entities/delivery-order-app.entity';
import { Cron } from '@nestjs/schedule/dist';

@Injectable()
export class InsertDataService {
  constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    @InjectRepository(DeliveryOrderTracking)
    private readonly trackingRepository: Repository<DeliveryOrderTracking>,
  ) {}

  // Set Time To Inject DB
  @Cron('0 0 * * * *', {
    timeZone: 'Asia/Makassar',
  })
  InjectData() {
    console.log('Inject Succesfully');
    this.insertData();
  }
  async inputTracking(item) {
    const res = await api.get(`delivery-order/${item.OrderNo}/tracking`);
    await Promise.all(
      res.data.map(async (data) => {
        const OidTrackingExist = await this.trackingRepository.exist({
          where: { Oid: data.Oid },
        });
        if (!OidTrackingExist) {
          console.log('input Tracking');
          const tracking = new DeliveryOrderTracking();
          tracking.Oid = data.Oid;
          tracking.OrderNo = data.OrderNo;
          tracking.Status = data.Status;
          tracking.Description = data.Description;
          tracking.Datetime = data.Date;
          await this.trackingRepository.save(tracking);
        }
      }),
    );
  }

  async inputDeliveryApp(item) {
    const OidExist = await this.deliveryOrderRepository.exist({
      where: { Oid: item.Oid },
    });
    if (!OidExist) {
      const data = new DeliveryOrder();
      data.Oid = item.Oid;
      data.CustomerId = item.CustomerId;
      data.Phone = item.CustomerPhone;
      data.Email = item.CustomerEmail;
      data.OrderDate = item.OrderDate;
      data.Commodity = item.Commodity;
      data.Remarks = item.Remarks;
      data.RefNo = item.RefNo;
      data.Services = item.Services;
      data.Via = item.Via;
      data.TypeOfHandling = item.TypeOfHandling;
      data.TypeOfRate = item.TypeOfRate;
      data.Orides = item.Orides;
      data.CustomerAddres = item.ReceiverAddress;
      data.Receiver = item.Receiver;
      data.ReceiverAddress = item.ReceiverAddress;
      // Get OrderNo from API
      // const res = await api.get(`delivery-order/${item.Oid}`);
      data.OrderNo = item.OrderNo;

      await this.deliveryOrderRepository.save(data);
    }
  }

  async insertData() {
    try {
      const result = await api.get('delivery-order?order=DESC&page=5&take=50');
      const data = result.data.data;
      await Promise.all(
        data.map(async (item) => {
          await this.inputDeliveryApp(item);
          await this.inputTracking(item);
        }),
      );
    } catch (error) {
      console.log(error.message);
    }
    return {
      message: 'Success',
    };
  }
}
