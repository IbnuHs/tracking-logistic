import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DeliveryOrder } from './delivery-order.entity';

@Entity('transp_deliveryorder_tracking_app')
export class DeliveryOrderTracking {
  @PrimaryGeneratedColumn('uuid')
  Oid: string;

  @ManyToOne(() => DeliveryOrder, (delivery) => delivery.OrderNo)
  @JoinColumn({ name: 'OrderNo', referencedColumnName: 'OrderNo' })
  OrderNo: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  Status: string;

  @Column({ type: 'text' })
  Description: string;

  @Column({ type: 'datetime' })
  Datetime: Date;

  // @ManyToOne(() => DeliveryOrder, (deliveryOrder) => deliveryOrder.tracking)
  // @JoinColumn()
  // deliveryOrder: DeliveryOrder;
}
