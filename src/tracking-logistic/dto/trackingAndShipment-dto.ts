import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class TrackingAndShipmentDto {
  @ApiProperty({
    example: 'GWDBGG2023030033',
  })
  @IsNotEmpty()
  OrderNo: string;

  @ApiProperty({
    example: 'E695',
  })
  @IsNotEmpty()
  Access: string;
}
