import { PartialType } from '@nestjs/mapped-types';
import { CreateQuickOrderDto } from './create-quick-order.dto';

export class UpdateQuickOrderDto extends PartialType(CreateQuickOrderDto) {}
