import { Test, TestingModule } from '@nestjs/testing';
import { SendAccessCodeService } from './send-access-code.service';

describe('SendAccessCodeService', () => {
  let service: SendAccessCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendAccessCodeService],
    }).compile();

    service = module.get<SendAccessCodeService>(SendAccessCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
