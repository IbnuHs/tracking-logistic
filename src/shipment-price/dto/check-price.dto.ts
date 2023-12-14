import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class CheckPriceDto {
  @ApiProperty({
    example: 'GWDBGG2023030033',
  })
  @IsNotEmpty()
  origin: string;

  @IsNotEmpty()
  destionation: string;

  @IsNotEmpty()
  weight: number;
}
