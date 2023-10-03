import { IsNotEmpty } from 'class-validator';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';

export class getRatingDto {
  @IsNotEmpty()
  DeliveryOid: DeliveryOrder;
}
