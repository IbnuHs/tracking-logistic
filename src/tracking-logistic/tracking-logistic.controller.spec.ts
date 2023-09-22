import { Test, TestingModule } from '@nestjs/testing';
import { TrackingLogisticController } from './tracking-logistic.controller';
import { TrackingLogisticService } from './tracking-logistic.service';

describe('TrackingLogisticController', () => {
  let controller: TrackingLogisticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrackingLogisticController],
      providers: [TrackingLogisticService],
    }).compile();

    controller = module.get<TrackingLogisticController>(TrackingLogisticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
