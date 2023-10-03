import { Injectable } from '@nestjs/common';
import { CreateCustomerServiceDto } from './dto/create-customer-service.dto';
import { UpdateCustomerServiceDto } from './dto/update-customer-service.dto';

@Injectable()
export class CustomerServiceService {
  create(createCustomerServiceDto: CreateCustomerServiceDto) {
    return 'This action adds a new customerService';
  }

  findAll() {
    return `This action returns all customerService`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customerService`;
  }

  update(id: number, updateCustomerServiceDto: UpdateCustomerServiceDto) {
    return `This action updates a #${id} customerService`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerService`;
  }
}
