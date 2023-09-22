import { PartialType } from '@nestjs/mapped-types';
import { CreateSendAccessCodeDto } from './create-send-access-code.dto';

export class UpdateSendAccessCodeDto extends PartialType(CreateSendAccessCodeDto) {}
