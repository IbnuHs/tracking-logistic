import { IsString, IsNotEmpty } from 'class-validator';

export class DeliveryOrderTrackingDto {
  @IsString()
  @IsNotEmpty()
  orderNo: string;
}
