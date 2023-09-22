import { IsNotEmpty } from 'class-validator';

export class TrackingAndShipmentDto {
  @IsNotEmpty()
  OrderNo: string;

  @IsNotEmpty()
  Access: string;
}
