import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ElementToDocument } from '../../documents/entities/elementToDocument.entity';

@Entity()
export class Element {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  type: 'text' | 'button' | 'image';

  @OneToMany(
    () => ElementToDocument,
    (elementToDocuments) => elementToDocuments.element,
  )
  public elementToDocuments: ElementToDocument[];

  // @ManyToMany((document) => Document, (document) => document.elements)
  // documents?: Document[];

  @Column({ type: 'timestamp', default: 'now()' })
  updatedAt: Date;

  @Column({ type: 'timestamp', default: 'now()' })
  createdAt: Date;
}
