import { IsNotEmpty } from 'class-validator';

export class SendAccessEmailDto {
  @IsNotEmpty()
  OrderNo: string;
}
