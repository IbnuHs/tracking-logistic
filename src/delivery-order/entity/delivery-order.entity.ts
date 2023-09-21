import { Customer } from 'src/customer/entity/customer.entity';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('transp_deliveryorder_app')
export class DeliveryOrder {
  @Column({ type: 'varchar', length: '40', nullable: false })
  Branch: string;

  @PrimaryColumn({ type: 'varchar', length: '100', nullable: false })
  OrderNo: string;

  @Column({ type: 'varchar', length: '20', nullable: false })
  Services: string;

  @Column({ type: 'varchar', length: '10', nullable: false })
  Via: string;

  @Column({ type: 'varchar', length: '40', nullable: false })
  TypeOfHandling: string;

  @Column({ type: 'varchar', length: '40', nullable: false })
  TypeOfRate: string;

  @Column({ type: 'varchar', length: '30', nullable: false })
  CustomerId: string;

  @Column({ type: 'varchar', length: '100', nullable: false })
  Customer: string;

  @Column({ type: 'varchar', length: '100', nullable: false })
  Orides: string;

  @Column({ type: 'varchar', length: '100' })
  Receiver: string;

  @Column({ type: 'varchar', length: '100' })
  ReceivingAt: string;

  @ManyToOne(() => Customer, (customer) => customer.order, {
    createForeignKeyConstraints: false,
  })
  customerData: Customer;
}
