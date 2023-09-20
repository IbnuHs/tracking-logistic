import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('transp_deliveryorder_app')
export class DeliveryOrder {
  @Column({ type: 'varchar', length: '40' })
  Branch: string;

  @PrimaryColumn({ type: 'varchar', length: '100' })
  OrderNo: string;

  @Column({ type: 'varchar', length: '20', nullable: false })
  Services: string;

  @Column({ type: 'varchar', length: '10' })
  Via: string;

  @Column({ type: 'varchar', length: '40' })
  TypeOfHandling: string;

  @Column({ type: 'varchar', length: '40' })
  TypeOfRate: string;

  @Column({ type: 'varchar', length: '30', nullable: false })
  CustomerId: string;

  @Column({ type: 'varchar', length: '100' })
  Customer: string;

  @Column({ type: 'varchar', length: '100' })
  Receiver: string;

  @Column({ type: 'varchar', length: '100' })
  ReceivingAt: string;
}
