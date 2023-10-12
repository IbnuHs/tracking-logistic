import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Customer } from './customer.entity';
import { DeliveryOrderTracking } from './delivery-order-app.entity';
import { type } from 'os';

@Entity('transp_deliveryorder_app')
export class DeliveryOrder {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  Oid: string;

  @Column({ type: 'varchar', length: 40, nullable: false })
  Branch: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  Access: string;

  @Column({ type: 'varchar', length: 40, nullable: false, unique: true })
  OrderNo: string;

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

  @Column({ type: 'varchar', length: 100 })
  Receiver: string;

  @Column({ type: 'text' })
  ReceiverAddress: string;

  @ManyToOne(() => Customer, (customer) => customer.Oid)
  @JoinColumn({ name: 'CustomerOid' })
  customer: Customer;

  @OneToMany(() => DeliveryOrderTracking, (tracking) => tracking.OrderNo)
  tracking: DeliveryOrderTracking[];
}
