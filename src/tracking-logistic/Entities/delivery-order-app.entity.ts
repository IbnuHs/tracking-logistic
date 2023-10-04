import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { DeliveryOrder } from './delivery-order.entity';

@Entity('transp_deliveryorder_tracking_app')
export class DeliveryOrderTracking {
  @PrimaryColumn({ type: 'int', nullable: false })
  Oid: number;

  @Column({ type: 'varchar', length: 40, nullable: false })
  OrderNo: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  Status: string;

  @Column({ type: 'text' })
  Description: string;

  @Column({ type: 'datetime' })
  Datetime: Date;

  @ManyToOne(() => DeliveryOrder, (Do) => Do.Oid)
  DeliveryOrder: DeliveryOrder;
}
