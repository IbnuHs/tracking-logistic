import { IsString, IsNotEmpty } from 'class-validator';

export class DeliveryOrderDto {
  @IsString()
  @IsNotEmpty()
  OrderNo: string;
}
