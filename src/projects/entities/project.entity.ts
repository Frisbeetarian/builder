import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Document } from '../../documents/entities/document.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany((document) => Document, (document) => document.projects, {
    cascade: true,
  })
  documents?: Document[];

  @Column()
  updatedAt: Date;

  @Column()
  createdAt: Date;
}
