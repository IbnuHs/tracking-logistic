import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { quickOrderEnum } from './quick-order.enum';

@Entity('quick_order_app')
export class QuickOrder {
  @PrimaryGeneratedColumn()
  Oid: string;

  @Column({ type: 'varchar', length: 100 })
  Customer: string;

  @Column({ type: 'varchar', length: 100 })
  TypeOfBusiness: string;

  @Column({ type: 'varchar', length: 20 })
  Phone: string;

  @Column({ type: 'varchar', length: 50 })
  Email: string;

  @Column({ type: 'varchar', length: 50 })
  Province: string;

  @Column({ type: 'varchar', length: 50 })
  City: string;

  @Column({ type: 'varchar', length: 50 })
  District: string;

  @Column({ type: 'varchar', length: 50 })
  Village: string;

  @Column({ type: 'varchar', length: 255 })
  Address: string;

  @Column({ type: 'smallint' })
  PostalCode: number;

  @Column({ type: 'text' })
  Goods: string;

  @Column({ type: 'smallint' })
  Qty: number;

  @Column({ type: 'enum', enum: quickOrderEnum })
  Status: quickOrderEnum;

  @Column({ type: 'date' })
  EntryDate: Date;
}
