import { IsNotEmpty } from 'class-validator';

export class SendAccessWADto {
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  orderNo: string;
}
