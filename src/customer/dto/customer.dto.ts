import { IsNotEmpty } from 'class-validator';
export class csutomerDto {
  @IsNotEmpty()
  email: string;
}
