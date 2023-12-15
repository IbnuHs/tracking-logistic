import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class CheckPriceDto {
  @ApiProperty({
    example: 'GWDBGG2023030033',
  })
  @IsNotEmpty()
  originId: number;

  @IsNotEmpty()
  destionationId: number;

  @IsNotEmpty()
  weight: number;
}
