import { Column, Entity, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { DeliveryOrder } from './delivery-order.entity';

@Entity('transp_deliveryorder_tracking_app')
export class DeliveryOrderTracking {
  @PrimaryColumn({ type: 'int', nullable: false })
  Oid: number;

  // @ManyToOne(() => DeliveryOrder, (delivery) => delivery.OrderNo)
  // @JoinColumn({ name: 'OrderNo', referencedColumnName: 'OrderNo' })
  // OrderNo: string;

  @Column({ type: 'varchar', length: 30, nullable: false })
  Status: string;

  @Column({ type: 'text' })
  Description: string;

  @Column({ type: 'datetime' })
  Datetime: Date;

  @ManyToOne(() => DeliveryOrder, (deliveryOrder) => deliveryOrder.tracking)
  @JoinColumn()
  deliveryOrder: DeliveryOrder;
}
