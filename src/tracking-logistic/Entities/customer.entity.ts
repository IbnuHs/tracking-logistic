import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Customer {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  Oid: string;

  @Column({ type: 'varchar', length: '30' })
  CustomerId: string;

  @Column({ type: 'varchar', length: '100' })
  Customer: string;

  @Column({ type: 'varchar', length: '20', nullable: false })
  Phone: string;

  @Column({ type: 'varchar', length: '50', nullable: false })
  Email: string;

  @Column({ type: 'varchar', length: '255', nullable: false })
  Address: string;

  @CreateDateColumn()
  EntryDate: Date;

  // @OneToMany(() => DeliveryOrder, (deliveryOrder) => deliveryOrder.customer)
  // deliveryOrders: DeliveryOrder[];
}
