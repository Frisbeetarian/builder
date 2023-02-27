import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Document } from '../documents/entities/document.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Coffee } from '../coffees/entities/project.entity';
import { UpdateCoffeeDto } from '../coffees/dto/update-coffee.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    private readonly dataSource: DataSource,
  ) {}

  async findOne(uuid: string) {
    const project = await this.projectsRepository.findOne({
      where: { uuid: uuid },
      relations: ['documents'],
    });

    if (!project) {
      throw new NotFoundException(`Project #${uuid} not found`);
    }

    return project;
  }

  findAll(paginationQuery: PaginationQueryDto): Promise<Project[]> {
    const { limit, offset } = paginationQuery;
    return this.projectsRepository.find({
      relations: ['documents'],
      skip: offset,
      take: limit,
    });
  }

  async create(createProjectDto: CreateProjectDto) {
    console.log('create project dto:', createProjectDto);
    const project = this.projectsRepository.create({
      ...createProjectDto,
      documents: [],
    });

    return this.projectsRepository.save(project);
  }

  async update(uuid: string, updateProjectDto: UpdateProjectDto) {
    const documents =
      updateProjectDto.documents &&
      (await Promise.all(
        updateProjectDto.documents.map((document) =>
          this.preloadDocumentByUuid(document.uuid),
        ),
      ));

    const project = await this.projectsRepository.preload({
      uuid,
      ...updateProjectDto,
      documents,
    });

    if (!project) {
      throw new NotFoundException(`Project #${uuid} not found`);
    }

    return this.projectsRepository.save(project);
  }

  async remove(uuid: string) {
    const project = await this.findOne(uuid);
    return this.projectsRepository.remove(project);
  }

  private async preloadDocumentByUuid(uuid: string): Promise<Document> {
    const existingDocument = await this.documentsRepository.findOne({
      where: { uuid: uuid },
    });

    if (existingDocument) {
      return existingDocument;
    } else {
      return null;
    }
  }
}
