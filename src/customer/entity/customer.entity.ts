import { DeliveryOrder } from 'src/delivery-order/entity/delivery-order.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('customers_app')
export class Customer {
  @PrimaryColumn({ type: 'varchar', length: '30', primary: true })
  CustomerId: string;

  @Column({ type: 'varchar', length: '20', nullable: false })
  Phone: string;

  @Column({ type: 'varchar', length: '50', nullable: false })
  Email: string;

  @Column({ type: 'varchar', length: '255', nullable: false })
  Address: string;

  @OneToMany(() => DeliveryOrder, (deliveryOrder) => deliveryOrder.customerData)
  order: DeliveryOrder[];
}
