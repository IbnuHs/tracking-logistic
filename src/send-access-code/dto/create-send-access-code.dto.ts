import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSendAccessCodeDto {
  @ApiProperty()
  @IsNotEmpty()
  contact: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  orderNo: string;
}
