import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Index(['name'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column('json')
  payload: Record<string, any>;
}
