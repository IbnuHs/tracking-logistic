import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CheckPriceDto } from './dto/check-price.dto';
import { Location } from './entities/location.entities';
import { HaversineCalculator } from './haversine-calculator';

@Injectable()
export class ShipmentPriceService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async getPrice(checkPrice: CheckPriceDto) {
    try {
      const shipmentRatePerkilo = 2000;
      const shipmentRatePerKm = 100;
      const getOrigin = await this.locationRepository.findOne({
        where: {
          kecamatan: checkPrice.origin,
        },
      });

      const getDestination = await this.locationRepository.findOne({
        where: {
          kecamatan: checkPrice.destionation,
        },
      });

      const distance = Math.ceil(
        HaversineCalculator.haversineDistance(
          [getOrigin.latitude, getOrigin.longitude],
          [getDestination.latitude, getDestination.longitude],
        ),
      );

      const price = Math.ceil(
        distance * shipmentRatePerKm + checkPrice.weight * shipmentRatePerkilo,
      );

      return {
        status: HttpStatus.OK,
        message: 'Ongkos kirim berhasil dibuat',
        harga: price,
      };
    } catch (err) {
      throw err;
    }
  }

  async getAll() {
    try {
      const allData = await this.locationRepository.find();
      return {
        status: HttpStatus.OK,
        message: 'Berhasil mendapat data lokasi!',
        data: allData,
      };
    } catch (err) {
      throw err;
    }
  }
}
