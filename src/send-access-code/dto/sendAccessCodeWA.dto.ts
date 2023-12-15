import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class SendAccessWADto {
  @ApiProperty({
    description: 'Nomor order',
    example: 'GWDBGG2023030033',
  })
  @IsNotEmpty()
  OrderNo: string;
}
