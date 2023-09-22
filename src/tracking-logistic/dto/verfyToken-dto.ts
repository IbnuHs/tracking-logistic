import { IsNotEmpty } from 'class-validator';

export class VerifyTokenDto {
  @IsNotEmpty()
  OrderNo: string;

  @IsNotEmpty()
  Access: string;
}
