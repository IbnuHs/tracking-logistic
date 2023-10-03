import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';
import { getRatingDto } from './dto/get-rating.dto';

@Controller('rating')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.createRating(createRatingDto);
  }

  // @UsePipes(new ValidationPipe())
  @Get()
  getRating(@Body() dto: getRatingDto) {
    return this.ratingService.getRating(dto);
    // return deliveryOid;
  }
}
