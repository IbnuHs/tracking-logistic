import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('transp_deliveryorder_tracking_app')
export class DeliveryOrderTracking {
  @PrimaryColumn({ type: 'int', nullable: false })
  Id: number;

  @Column({ type: 'varchar', length: '40' })
  OrderNo: string;

  @Column({ type: 'varchar', length: '30' })
  Status: string;

  @Column({ type: 'text' })
  Description: string;

  @Column({ type: 'datetime' })
  Datetime: Date;
}
