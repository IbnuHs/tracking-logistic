import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsString, IsNotEmpty } from 'class-validator';

export class DeliveryOrderDto {
  @ApiProperty({
    example: 'GWDBGG2023030033',
  })
  @IsString()
  @IsNotEmpty()
  OrderNo: string;
}
