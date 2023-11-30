import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class CustomerService {
  @PrimaryColumn({ type: 'varchar', length: 40 })
  Oid: string;

  @Column({ type: 'varchar', length: 10 })
  Username: string;

  @Column({ type: 'varchar', length: 12 })
  Pass: string;

  @Column({ type: 'varchar', length: 20 })
  Phone: string;

  @Column({ type: 'varchar', length: 50 })
  Email: string;
}
