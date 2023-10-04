import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateQuickOrderDto } from './dto/create-quick-order.dto';
import { UpdateQuickOrderDto } from './dto/update-quick-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QuickOrder } from './entities/quick-order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class QuickOrderService {
  constructor(
    @InjectRepository(QuickOrder)
    private readonly quickOrderRepository: Repository<QuickOrder>,
  ) {}
  async createQuickOrder(createQuickOrderDto: CreateQuickOrderDto) {
    try {
      const order = new QuickOrder();
      order.Customer = createQuickOrderDto.Customer;
      order.TypeOfBusiness = createQuickOrderDto.TypeOfBusiness;
      order.Phone = createQuickOrderDto.Phone;
      order.Email = createQuickOrderDto.Email;
      order.Province = createQuickOrderDto.Province;
      order.City = createQuickOrderDto.City;
      order.District = createQuickOrderDto.District;
      order.Village = createQuickOrderDto.Village;
      order.Address = createQuickOrderDto.Address;
      order.PostalCode = createQuickOrderDto.PostalCode;
      order.Goods = createQuickOrderDto.Goods;
      order.Status = createQuickOrderDto.Status;
      order.EntryDate = new Date();

      const newOrder = await this.quickOrderRepository.save(order);

      return {
        statusCode: HttpStatus.OK,
        order: newOrder,
      };
    } catch (error) {
      return error.message;
    }
  }

  findAll() {
    return `This action returns all quickOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quickOrder`;
  }

  update(id: number, updateQuickOrderDto: UpdateQuickOrderDto) {
    return `This action updates a #${id} quickOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} quickOrder`;
  }
}
