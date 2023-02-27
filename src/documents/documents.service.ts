import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { DataSource, Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CreateDocumentDto } from './dto/create-document-dto';
import { UpdateDocumentDto } from './dto/update-document-dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    private readonly dataSource: DataSource,
  ) {}

  async findOne(uuid: string) {
    const document = await this.documentsRepository.findOne({
      where: { uuid: uuid },
      relations: ['projects'],
    });

    if (!document) {
      throw new NotFoundException(`Document #${uuid} not found`);
    }

    return document;
  }

  findAll(paginationQuery: PaginationQueryDto): Promise<Document[]> {
    const { limit, offset } = paginationQuery;
    return this.documentsRepository.find({
      relations: ['projects'],
      skip: offset,
      take: limit,
    });
  }

  async create(createDocumentDto: CreateDocumentDto) {
    console.log('create document dto:', createDocumentDto);
    const project = this.documentsRepository.create({
      ...createDocumentDto,
      projects: [],
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
