import { IsNotEmpty } from 'class-validator';

export class trackingDto {
  @IsNotEmpty()
  OrderNo: string;
}
