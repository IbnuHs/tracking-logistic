import { PartialType } from '@nestjs/mapped-types';
import { CreateInsertDatumDto } from './create-insert-datum.dto';

export class UpdateInsertDatumDto extends PartialType(CreateInsertDatumDto) {}
