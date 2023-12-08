import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class SendAccessEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  OrderNo: string;
}
