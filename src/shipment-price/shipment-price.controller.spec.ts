import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentPriceController } from './shipment-price.controller';
import { ShipmentPriceService } from './shipment-price.service';

describe('ShipmentPriceController', () => {
  let controller: ShipmentPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentPriceController],
      providers: [ShipmentPriceService],
    }).compile();

    controller = module.get<ShipmentPriceController>(ShipmentPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
