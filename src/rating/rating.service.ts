import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRatingDto } from './dto/create-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';
import { getRatingDto } from './dto/get-rating.dto';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  async createRating(createRatingDto: CreateRatingDto): Promise<object> {
    const { OrderNo, DeliveryRating } = createRatingDto;
    console.log(OrderNo);
    const rating = new Rating();
    rating.Delivery = OrderNo;
    rating.DeliveryRating = DeliveryRating;

    try {
      await this.ratingRepository.save(rating);
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Rating ditambahkan',
    };

    // return 'This action adds a new rating';
  }

  async getRating(GetRatingDto: getRatingDto): Promise<object> {
    try {
      const ratingData = await this.ratingRepository.findOne({
        where: {
          Delivery: {
            OrderNo: GetRatingDto.OrderNo,
          },
        },
        relations: {
          Delivery: true,
        },
      });

      if (!ratingData) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Rating tidak ditemukan',
        };
      }

      const orderNo = ratingData.Delivery.OrderNo;
      delete ratingData.Delivery;
      return {
        statusCode: HttpStatus.OK,
        message: 'Data ditemukan',
        data: {
          ...ratingData,
          OrderNo: orderNo,
        },
      };
    } catch (err) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: err.message,
      };
    }
  }
}
