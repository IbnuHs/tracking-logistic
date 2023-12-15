import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class deliveryAppDto {
  @ApiProperty({
    description: 'Customer Id',
  })
  @IsNotEmpty()
  CustomerId: string;
}
