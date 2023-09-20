import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryOrderTrackingService } from './delivery-order-tracking.service';

describe('DeliveryOrderTrackingService', () => {
  let service: DeliveryOrderTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryOrderTrackingService],
    }).compile();

    service = module.get<DeliveryOrderTrackingService>(DeliveryOrderTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
