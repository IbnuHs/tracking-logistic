import { Injectable } from '@nestjs/common';
import { CreateSendAccessCodeDto } from './dto/create-send-access-code.dto';
import { UpdateSendAccessCodeDto } from './dto/update-send-access-code.dto';

@Injectable()
export class SendAccessCodeService {
  create(createSendAccessCodeDto: CreateSendAccessCodeDto) {
    return 'This action adds a new sendAccessCode';
  }

  findAll() {
    return `This action returns all sendAccessCode`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sendAccessCode`;
  }

  update(id: number, updateSendAccessCodeDto: UpdateSendAccessCodeDto) {
    return `This action updates a #${id} sendAccessCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} sendAccessCode`;
  }
}
