import { IsNotEmpty } from 'class-validator';

export class SendAccessEmailDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  orderNo: string;
}
