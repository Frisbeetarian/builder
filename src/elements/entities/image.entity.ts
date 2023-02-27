import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column()
  updatedAt: Date;

  @Column()
  createdAt: Date;
}
