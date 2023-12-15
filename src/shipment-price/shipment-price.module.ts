import { Module } from '@nestjs/common';
import { ShipmentPriceService } from './shipment-price.service';
import { ShipmentPriceController } from './shipment-price.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Location } from './entities/location.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Location])],
  controllers: [ShipmentPriceController],
  providers: [ShipmentPriceService],
})
export class ShipmentPriceModule {}
