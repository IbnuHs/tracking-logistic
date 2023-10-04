import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RatingEnum } from './rating.enum';
import { type } from 'os';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';

@Entity('rating_deliveryorder_tracking_app')
export class Rating {
  @PrimaryGeneratedColumn()
  Oid: string;

  @OneToOne(() => DeliveryOrder)
  @JoinColumn()
  Delivery: DeliveryOrder;

  @Column({ type: 'enum', enum: RatingEnum })
  DeliveryRating: RatingEnum;

  @CreateDateColumn()
  EntryDate: Date;
}
