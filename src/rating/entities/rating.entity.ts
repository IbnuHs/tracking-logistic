import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RatingEnum } from './rating.enum';
import { DeliveryOrder } from 'src/tracking-logistic/Entities/delivery-order.entity';

@Entity('rating_deliveryorder_tracking_app')
export class Rating {
  @PrimaryGeneratedColumn()
  Oid: string;

  @OneToOne(() => DeliveryOrder, (delivery) => delivery.OrderNo)
  @JoinColumn({ name: 'OrderNo', referencedColumnName: 'OrderNo' })
  Delivery: DeliveryOrder;

  @Column({ type: 'enum', enum: RatingEnum })
  DeliveryRating: RatingEnum;

  @CreateDateColumn()
  EntryDate: Date;
}
