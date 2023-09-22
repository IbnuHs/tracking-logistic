import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryOrderTrackingController } from './delivery-order-tracking.controller';

describe('DeliveryOrderTrackingController', () => {
  let controller: DeliveryOrderTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryOrderTrackingController],
    }).compile();

    controller = module.get<DeliveryOrderTrackingController>(DeliveryOrderTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
