import { IsEnum, IsNotEmpty, isNotEmpty } from 'class-validator';
import { quickOrderEnum } from '../entities/quick-order.enum';

export class CreateQuickOrderDto {
  @IsNotEmpty()
  Customer: string;

  @IsNotEmpty()
  TypeOfBusiness: string;

  @IsNotEmpty()
  Phone: string;

  @IsNotEmpty()
  Email: string;

  @IsNotEmpty()
  Province: string;

  @IsNotEmpty()
  City: string;

  @IsNotEmpty()
  District: string;

  @IsNotEmpty()
  Village: string;

  @IsNotEmpty()
  Address: string;

  @IsNotEmpty()
  PostalCode: number;

  @IsNotEmpty()
  Goods: string;

  @IsNotEmpty()
  Qty: number;

  @IsNotEmpty()
  @IsEnum(quickOrderEnum)
  Status: quickOrderEnum;

  //   @IsNotEmpty()
  //   EntryDate: Date;
}
