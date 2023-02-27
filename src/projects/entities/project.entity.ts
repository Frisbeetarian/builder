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
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany((document) => Document, (document) => document.projects, {
    cascade: true,
  })
  documents?: Document[];

  @Column({ type: 'timestamp', default: 'now()' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: 'now()' })
  createdAt: Date;
}
