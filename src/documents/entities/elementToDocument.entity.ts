import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  Index,
} from 'typeorm';
import { Element } from '../../elements/entities/element.entity';
import { Document } from './document.entity';

@Entity()
@Index(['documentUuid', 'order'], { unique: true })
export class ElementToDocument {
  @PrimaryGeneratedColumn('uuid')
  public uuid: string;

  @Column()
  public elementUuid: string;

  @Column()
  public documentUuid: string;

  @Column()
  public order: number;

  @ManyToOne(() => Element, (element) => element.elementToDocuments)
  public element: Element;

  @ManyToOne(() => Document, (document) => document.elementToDocuments)
  public document: Document;

  @Column({ type: 'timestamp', default: 'now()' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: 'now()' })
  createdAt: Date;
}
