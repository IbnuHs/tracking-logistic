import { IsNotEmpty } from '@nestjs/class-validator';

export class trackingDto {
  @IsNotEmpty()
  OrderNo: string;
}
