import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentPriceService } from './shipment-price.service';

describe('ShipmentPriceService', () => {
  let service: ShipmentPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShipmentPriceService],
    }).compile();

    service = module.get<ShipmentPriceService>(ShipmentPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
