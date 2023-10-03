import { IsEnum, IsNotEmpty } from 'class-validator';
import { RatingEnum } from '../entities/rating.enum';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';

export class CreateRatingDto {
  @IsNotEmpty()
  DeliveryOid: DeliveryOrder;

  @IsNotEmpty()
  @IsEnum(RatingEnum)
  DeliveryRating: RatingEnum;
}
