import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Element } from '../../elements/entities/element.entity';
import { Project } from '../../projects/entities/project.entity';
import { ElementToDocument } from '../elementToDocument.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @OneToMany(
    () => ElementToDocument,
    (elementToDocument) => elementToDocument.document,
  )
  public elementToDocuments: ElementToDocument[];

  // @JoinTable()
  // @ManyToMany((element) => Element, (element) => element.documents, {
  //   cascade: true,
  // })
  // elements?: Element[];

  @ManyToMany((project) => Project, (project) => project.documents)
  projects: Project[];

  @Column({ type: 'timestamp', default: 'now()' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: 'now()' })
  createdAt: Date;
}
