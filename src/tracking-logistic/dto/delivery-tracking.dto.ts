import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeliveryOrderDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  OrderNo: string;
}
