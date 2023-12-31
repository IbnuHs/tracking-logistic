import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsNotEmpty } from 'class-validator';

export class SendAccessEmailDto {
  @ApiProperty({
    example: 'GWDBGG2023030033',
  })
  @IsNotEmpty()
  OrderNo: string;
}
