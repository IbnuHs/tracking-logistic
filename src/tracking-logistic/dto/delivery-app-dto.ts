import { IsNotEmpty } from 'class-validator';

export class deliveryAppDto {
  @IsNotEmpty()
  CustomerId: string;
}
