import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class SendAccessWADto {
  @ApiProperty()
  @IsNotEmpty()
  OrderNo: string;
}
