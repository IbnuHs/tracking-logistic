import { IsNotEmpty } from 'class-validator';

export class CreateCustomerServiceDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
