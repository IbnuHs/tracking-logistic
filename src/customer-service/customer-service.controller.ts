import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CustomerServiceService } from './customer-service.service';
import { CreateCustomerServiceDto } from './dto/create-customer-service.dto';

@Controller('login')
export class CustomerServiceController {
  constructor(
    private readonly customerServiceService: CustomerServiceService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createCustomerServiceDto: CreateCustomerServiceDto) {
    return this.customerServiceService.Login(createCustomerServiceDto);
  }
}
