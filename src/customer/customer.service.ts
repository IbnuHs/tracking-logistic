import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entity/customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private CustomerRepository: Repository<Customer>,
  ) {}

  async getCustomer(id: string) {
    const customer = await this.CustomerRepository.findOne({
      where: {
        CustomerId: id,
      },
    });
    if (!customer) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Data customer tidak ditemukan',
      };
    }

    return customer;
  }
}
