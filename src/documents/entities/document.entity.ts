import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Element } from '../../elements/entities/element.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @JoinTable()
  @ManyToMany((element) => Element, (element) => element.documents, {
    cascade: true,
  })
  elements?: Element[];

  @ManyToMany((project) => Project, (project) => project.documents)
  projects: Project[];

  @Column({ type: 'timestamp', default: 'now()' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: 'now()' })
  createdAt: Date;
}
