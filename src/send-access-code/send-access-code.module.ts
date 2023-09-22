import { Module } from '@nestjs/common';
import { SendAccessCodeService } from './send-access-code.service';
import { SendAccessCodeController } from './send-access-code.controller';

@Module({
  controllers: [SendAccessCodeController],
  providers: [SendAccessCodeService],
})
export class SendAccessCodeModule {}
