import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/tracking-logistic/Entities/customer.entity';
import { Repository } from 'typeorm';
import { api } from './Api/api';
import axios from 'axios';
import * as https from 'https';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { DeliveryOrderTracking } from 'src/tracking-logistic/Entities/delivery-order-app.entity';

@Injectable()
export class InsertDataService {
  constructor(
    @InjectRepository(DeliveryOrder)
    private readonly deliveryOrderRepository: Repository<DeliveryOrder>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(DeliveryOrderTracking)
    private readonly trackingRepository: Repository<DeliveryOrder>,
  ) {}
  async insertData() {
    const page = 1;
    const limit = 10;
    const result = await axios.get(
      `https://transporter.kallatranslog.co.id/api/v1/delivery-order?page=${page}&limit=${limit}`,
      {
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: {
          'x-api-key': '123',
        },
      },
    );
    const data = result.data.items;

    data.forEach(async (data) => {
      const isCustIdExist = await this.customerRepository.exist({
        where: { CustomerId: data.customerOid },
      });
      if (!isCustIdExist) {
        const customerData = new Customer();
        customerData.CustomerId = data.customerOid;
        customerData.Customer = '';
        customerData.Phone = data.receiverPhone;
        (customerData.Email = ''),
          (customerData.Address = data.receiverAddress);
        await this.customerRepository.save(customerData);
      }

      const dataExist = await this.deliveryOrderRepository.exist({
        where: { Oid: data.oid },
      });
      if (!dataExist) {
        const dataInternal = new DeliveryOrder();
        dataInternal.Oid = data.oid;
        dataInternal.Branch = data.branch;
        dataInternal.Access = '1234';
        dataInternal.OrderNo = data.orderNo;
        dataInternal.Services = data.services;
        dataInternal.Via = data.via;
        dataInternal.TypeOfHandling = data.typeOfHandling;
        dataInternal.TypeOfRate = data.typeOfRate;
        dataInternal.Orides = data.orides;
        dataInternal.Receiver = data.receiver;
        dataInternal.ReceiverAddress = data.receiverAddress;
        dataInternal.customer = data.customerOid;

        await this.deliveryOrderRepository.save(dataInternal);
      }
      const tracking = await axios.get(
        `https://transporter.kallatranslog.co.id/api/v1/delivery-order/${data.orderNo}/tracking`,
        {
          httpsAgent: new https.Agent({ rejectUnauthorized: false }),
          headers: {
            'x-api-key': '123',
          },
        },
      );
      const trackingData = tracking.data;
      trackingData.forEach(async (e) => {
        const tracking = new DeliveryOrderTracking();
        tracking.OrderNo = e.orderNo;
        tracking.Status = e.status;
        tracking.Description = e.description;
        tracking.Datetime = e.date;
        await this.trackingRepository.save(tracking);
      });
    });
    return {
      message: 'Success',
      data: result.data,
    };
  }

  async fetchApi() {
    const res = await api.get('delivery-order/MKSPLP2023050249/tracking');
  }
}


