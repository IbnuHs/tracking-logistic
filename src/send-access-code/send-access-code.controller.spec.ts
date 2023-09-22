import { Test, TestingModule } from '@nestjs/testing';
import { SendAccessCodeController } from './send-access-code.controller';
import { SendAccessCodeService } from './send-access-code.service';

describe('SendAccessCodeController', () => {
  let controller: SendAccessCodeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendAccessCodeController],
      providers: [SendAccessCodeService],
    }).compile();

    controller = module.get<SendAccessCodeController>(SendAccessCodeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
