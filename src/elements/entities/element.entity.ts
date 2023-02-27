import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Document } from '../../documents/entities/document.entity';

@Entity()
export class Element {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column()
  name: string;

  @Column()
  type: 'text' | 'button' | 'image';

  @ManyToMany((document) => Document, (document) => document.elements)
  documents?: Document[];

  @Column()
  updatedAt: Date;

  @Column()
  createdAt: Date;
}
