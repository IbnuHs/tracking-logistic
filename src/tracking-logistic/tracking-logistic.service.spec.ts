import { Test, TestingModule } from '@nestjs/testing';
import { TrackingLogisticService } from './tracking-logistic.service';

describe('TrackingLogisticService', () => {
  let service: TrackingLogisticService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrackingLogisticService],
    }).compile();

    service = module.get<TrackingLogisticService>(TrackingLogisticService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
