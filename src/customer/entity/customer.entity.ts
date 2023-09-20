import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('customers_app')
export class Customer {
  @PrimaryColumn({ type: 'varchar', length: '30' })
  CustomerId: string;

  @Column({ type: 'varchar', length: '20' })
  Phone: string;

  @Column({ type: 'varchar', length: '50' })
  Email: string;

  @Column({ type: 'varchar', length: '255' })
  Address: string;
}
