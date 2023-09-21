import { IsNotEmpty } from '@nestjs/class-validator';
export class csutomerDto {
  @IsNotEmpty()
  email: string;
}
