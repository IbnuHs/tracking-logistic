import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { DeliveryOrderTracking } from './delivery-order-app.entity';

@Entity('transp_deliveryorder_app')
export class DeliveryOrder {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  Oid: string;

  @Column({ type: 'varchar', length: '30' })
  CustomerId: string;

  @Column({ type: 'varchar', length: '20', nullable: false })
  Phone: string;

  @Column({ type: 'varchar', length: '50', nullable: false })
  Email: string;

  @Column({ type: 'date' })
  OrderDate: Date;

  @Column({ type: 'varchar', length: '40', nullable: false })
  Commodity: string;

  @Column({ type: 'varchar', length: '40', nullable: false })
  Remarks: string;

  @Column({ type: 'varchar', length: '40', nullable: false })
  RefNo: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  Services: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  Via: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  TypeOfHandling: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  TypeOfRate: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  Orides: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  CustomerAddres: string;

  @Column({ type: 'varchar', length: 100 })
  Receiver: string;

  @Column({ type: 'text' })
  ReceiverAddress: string;

  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  OrderNo: string;

  @OneToMany(() => DeliveryOrderTracking, (tracking) => tracking.OrderNo)
  tracking: DeliveryOrderTracking[];
}
