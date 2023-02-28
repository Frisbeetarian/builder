import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Project } from '../projects/entities/project.entity';
import { Document } from './entities/document.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateDocumentDto } from './dto/create-document-dto';
import { UpdateDocumentDto } from './dto/update-document-dto';
import { Element } from '../elements/entities/element.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    @InjectRepository(Element)
    private readonly elementsRepository: Repository<Element>,

    private readonly dataSource: DataSource,
  ) {}

  async findOne(uuid: string) {
    const document = await this.documentsRepository.findOne({
      where: { uuid: uuid },
      relations: ['projects', 'elementToDocuments'],
    });

    if (!document) {
      throw new NotFoundException(`Document #${uuid} not found`);
    }

    const elements = await Promise.all(
      document.elementToDocuments.map(async (elementInDocument) => {
        const element = await this.elementsRepository.findOne({
          where: { uuid: elementInDocument.elementUuid },
        });

        return {
          ...element,
          order: elementInDocument.order,
          relationshipUuid: elementInDocument.uuid,
        };
      }),
    );

    delete document.elementToDocuments;

    return { ...document, elements };
  }

  async findAll(paginationQuery: PaginationQueryDto): Promise<Document[]> {
    const { limit, offset } = paginationQuery;
    let documents = await this.documentsRepository.find({
      relations: ['projects', 'elementToDocuments.element'],
      skip: offset,
      take: limit,
    });

    if (!documents) {
      throw new NotFoundException(`Documents not found`);
    }
    documents = await Promise.all(
      documents.map(async (document) => {
        const elements = await Promise.all(
          document.elementToDocuments.map(async (elementInDocument) => {
            const element = elementInDocument.element;

            delete document.elementToDocuments;

            return {
              ...element,
              order: elementInDocument.order,
              relationshipUuid: elementInDocument.uuid,
            };
          }),
        );

        return { ...document, elements };
      }),
    );

    return documents;
  }

  async create(createDocumentDto: CreateDocumentDto) {
    const project = this.documentsRepository.create({
      ...createDocumentDto,
    });

    return this.documentsRepository.save(project);
  }

  async update(uuid: string, updateDocumentDto: UpdateDocumentDto) {
    const projects =
      updateDocumentDto.projects &&
      (await Promise.all(
        updateDocumentDto.projects.map((document) =>
          this.preloadProjectByUuid(document.uuid),
        ),
      ));

    const document = await this.documentsRepository.preload({
      uuid,
      ...updateDocumentDto,
      projects,
    });

    if (!document) {
      throw new NotFoundException(`Document #${uuid} not found`);
    }

    return this.documentsRepository.save(document);
  }

  async remove(uuid: string) {
    const project = await this.findOne(uuid);
    return this.documentsRepository.remove(project);
  }

  private async preloadProjectByUuid(uuid: string): Promise<Project> {
    const existingProject = await this.projectsRepository.findOne({
      where: { uuid: uuid },
    });

    if (existingProject) {
      return existingProject;
    } else {
      return null;
    }
  }
}
