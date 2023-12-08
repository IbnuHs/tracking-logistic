import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class TrackingAndShipmentDto {
  @ApiProperty()
  @IsNotEmpty()
  OrderNo: string;

  @ApiProperty()
  @IsNotEmpty()
  Access: string;
}
