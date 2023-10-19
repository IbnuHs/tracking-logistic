import { IsNotEmpty } from 'class-validator';

export class SendAccessWADto {
  @IsNotEmpty()
  OrderNo: string;
}
