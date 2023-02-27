import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Document } from '../documents/entities/document.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Element } from './entities/element.entity';
import { CreateElementDto } from './dto/create-element-dto';
import { UpdateElementDto } from './dto/update-element-dto';
import { ElementToDocument } from '../documents/elementToDocument.entity';

@Injectable()
export class ElementsService {
  constructor(
    @InjectRepository(Element)
    private readonly elementsRepository: Repository<Element>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    @InjectRepository(ElementToDocument)
    private readonly elementToDocumentsRepository: Repository<ElementToDocument>,

    private readonly dataSource: DataSource,
  ) {}

  async findOne(uuid: string) {
    const element = await this.elementsRepository.findOne({
      where: { uuid: uuid },
      relations: ['elementToDocuments'],
    });

    if (!element) {
      throw new NotFoundException(`Element #${uuid} not found`);
    }

    return element;
  }

  findAll(paginationQuery: PaginationQueryDto): Promise<Element[]> {
    const { limit, offset } = paginationQuery;
    return this.elementsRepository.find({
      relations: ['documents'],
      skip: offset,
      take: limit,
    });
  }

  async create(createElementDto: CreateElementDto): Promise<Element> {
    try {
      console.log('create element dto:', createElementDto);

      const element = await this.elementsRepository.create({
        ...createElementDto,
      });
      const savedElement = await this.elementsRepository.save(
        element as Element,
      );

      console.log('savedElement:', savedElement);

      const elementToDocuments = createElementDto.documents.map((document) => {
        return {
          order: createElementDto.order,
          elementUuid: savedElement.uuid,
          documentUuid: document.uuid,
        };
      });

      console.log('elementToDocuments:', elementToDocuments);

      const dd = await this.elementToDocumentsRepository.create({
        ...elementToDocuments[0],
      });

      await this.elementToDocumentsRepository.save(dd);

      // const element = await this.elementsRepository.preload({
      //
      // })

      return savedElement;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

  async update(uuid: string, updateElementDto: UpdateElementDto) {
    const documents =
      updateElementDto.documents &&
      (await Promise.all(
        updateElementDto.documents.map((document) =>
          this.preloadDocumentByUuid(document.uuid),
        ),
      ));

    const element = await this.elementsRepository.preload({
      uuid,
      ...updateElementDto,
      // elementToDocuments: documents,
    });

    if (!element) {
      throw new NotFoundException(`Element #${uuid} not found`);
    }

    return this.elementsRepository.save(element);
  }

  async remove(uuid: string) {
    const element = await this.findOne(uuid);
    return this.elementsRepository.remove(element);
  }

  private async preloadDocumentByUuid(uuid: string): Promise<Document> {
    const existingProject = await this.documentsRepository.findOne({
      where: { uuid: uuid },
    });

    if (existingProject) {
      return existingProject;
    } else {
      return null;
    }
  }
}
