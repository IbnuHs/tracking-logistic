import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  async createRating(createRatingDto: CreateRatingDto) {
    const { DeliveryOid, DeliveryRating } = createRatingDto;
    const rating = new Rating();
    rating.Delivery = DeliveryOid;
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

  async getRating(GetRatingDto: getRatingDto) {
    // return deliveryOid;
    const oid = GetRatingDto;
    console.log(oid.DeliveryOid);
    try {
      const rating = await this.ratingRepository.find({
        where: {
          Delivery: {
            Oid: oid.DeliveryOid.Oid,
          },
        },
        relations: {
          Delivery: true,
        },
      });
      // console.log(rating);
      return rating;
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}
