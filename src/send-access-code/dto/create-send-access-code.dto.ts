import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSendAccessCodeDto {
  @IsNotEmpty()
  contact: string;

  @IsNotEmpty()
  @IsString()
  orderNo: string;
}
