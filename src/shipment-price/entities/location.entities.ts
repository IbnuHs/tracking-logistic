import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: '128' })
  kabupaten: string;

  @Column({ type: 'varchar', length: '128' })
  kecamatan: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;
}
