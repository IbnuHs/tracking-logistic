import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class deliveryAppDto {
  @ApiProperty()
  @IsNotEmpty()
  CustomerId: string;
}
