import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Document } from '../documents/entities/document.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Element } from './entities/element.entity';
import { CreateElementDto } from './dto/create-element-dto';
import { UpdateElementDto } from './dto/update-element-dto';
import { ElementToDocument } from '../documents/entities/elementToDocument.entity';
import { AssignElementToDocumentDto } from './dto/assign-element-to-document-dto';
import { UpdateElementToDocumentDto } from './dto/update-element-to-document-dto';
import { RemoveElementFromDocumentDto } from './dto/remove-element-from-document-dto';

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
      relations: ['elementToDocuments'],
      skip: offset,
      take: limit,
    });
  }

  async create(createElementDto: CreateElementDto): Promise<Element> {
    try {
      const element = await this.elementsRepository.save({
        ...createElementDto,
      });

      const elementToDocuments = createElementDto.documents.map((document) => {
        return {
          order: createElementDto.order,
          elementUuid: element.uuid,
          documentUuid: document.uuid,
        };
      });

      const association = await this.elementToDocumentsRepository.create({
        ...elementToDocuments[0],
      });

      await this.elementToDocumentsRepository.save(association);

      return element;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }

  async assignElementToDocument(
    assignElementToDocumentDto: AssignElementToDocumentDto,
  ): Promise<Element> {
    const element = await this.elementsRepository.findOne({
      where: { uuid: assignElementToDocumentDto.elementUuid },
      relations: ['elementToDocuments'],
    });

    const document = await this.documentsRepository.findOne({
      where: { uuid: assignElementToDocumentDto.documentUuid },
      relations: ['elementToDocuments'],
    });

    if (!element) {
      throw new NotFoundException(
        `Element #${assignElementToDocumentDto.elementUuid} not found`,
      );
    }

    if (!document) {
      throw new NotFoundException(
        `Document #${assignElementToDocumentDto.documentUuid} not found`,
      );
    }

    const elementsToDocument = await this.elementToDocumentsRepository.find({
      where: {
        elementUuid: assignElementToDocumentDto.elementUuid,
        documentUuid: assignElementToDocumentDto.documentUuid,
      },
    });

    if (elementsToDocument) {
      const elementWithSameOrder = elementsToDocument.find(
        (element) => element.order === Number(assignElementToDocumentDto.order),
      );

      if (elementWithSameOrder) {
        throw new BadRequestException(
          `Element #${assignElementToDocumentDto.elementUuid} with same order already assigned to document #${assignElementToDocumentDto.documentUuid}`,
        );
      } else {
        const newElementToDocument =
          await this.elementToDocumentsRepository.create({
            elementUuid: assignElementToDocumentDto.elementUuid,
            documentUuid: assignElementToDocumentDto.documentUuid,
            order: assignElementToDocumentDto.order,
          });

        await this.elementToDocumentsRepository.save(newElementToDocument);

        return element;
      }
    } else {
      const newElementToDocument =
        await this.elementToDocumentsRepository.create({
          elementUuid: assignElementToDocumentDto.elementUuid,
          documentUuid: assignElementToDocumentDto.documentUuid,
          order: assignElementToDocumentDto.order,
        });

      await this.elementToDocumentsRepository.save(newElementToDocument);

      return element;
    }
  }
  async updateElementInDocument(
    updateElementInDocumentDto: UpdateElementToDocumentDto,
  ): Promise<Element> {
    const element = await this.elementsRepository.findOne({
      where: { uuid: updateElementInDocumentDto.elementUuid },
      relations: ['elementToDocuments'],
    });

    const document = await this.documentsRepository.findOne({
      where: { uuid: updateElementInDocumentDto.documentUuid },
      relations: ['elementToDocuments'],
    });

    if (!element) {
      throw new NotFoundException(
        `Element #${updateElementInDocumentDto.elementUuid} not found`,
      );
    }

    if (!document) {
      throw new NotFoundException(
        `Document #${updateElementInDocumentDto.documentUuid} not found`,
      );
    }

    const elementToDocument = await this.elementToDocumentsRepository.findOne({
      where: {
        uuid: updateElementInDocumentDto.relationshipUuid,
      },
    });

    if (!elementToDocument) {
      throw new Error(
        `Element #${updateElementInDocumentDto.elementUuid} not assigned to document #${updateElementInDocumentDto.documentUuid}`,
      );
    }

    const elementsToDocument = await this.elementToDocumentsRepository.find({
      where: {
        elementUuid: updateElementInDocumentDto.elementUuid,
        documentUuid: updateElementInDocumentDto.documentUuid,
      },
    });

    if (elementsToDocument) {
      const elementWithSameOrder = elementsToDocument.find(
        (element) => element.order === Number(updateElementInDocumentDto.order),
      );

      if (elementWithSameOrder) {
        throw new BadRequestException(
          `Element #${updateElementInDocumentDto.elementUuid} with same order already assigned to document #${updateElementInDocumentDto.documentUuid}`,
        );
      }
    }

    elementToDocument.order = updateElementInDocumentDto.order;

    await this.elementToDocumentsRepository.save(elementToDocument);

    return element;
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

  async removeElementFromDocument(relationshipUuid: string): Promise<boolean> {
    const elementToDocument = await this.elementToDocumentsRepository.findOne({
      where: {
        uuid: relationshipUuid,
      },
    });

    if (!elementToDocument) {
      throw new NotFoundException(`Element not assigned to document.`);
    }

    await this.elementToDocumentsRepository.remove(elementToDocument);

    return true;
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
