import { IsNotEmpty } from 'class-validator';

export class getRatingDto {
  @IsNotEmpty()
  OrderNo: string;
}
