import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerServiceDto } from './create-customer-service.dto';

export class UpdateCustomerServiceDto extends PartialType(CreateCustomerServiceDto) {}
