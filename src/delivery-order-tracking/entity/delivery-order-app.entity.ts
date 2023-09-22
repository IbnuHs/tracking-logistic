import { DeliveryOrder } from 'src/delivery-order/entity/delivery-order.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

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

  @OneToOne(() => DeliveryOrder)
  @JoinColumn()
  DeliveryOrder: string;
}
