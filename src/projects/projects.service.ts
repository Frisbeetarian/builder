import { Injectable } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { Document } from '../documents/entities/document.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    console.log('create project dto:', createProjectDto);
    const project = this.projectsRepository.create({
      ...createProjectDto,
      documents: [],
    });

    return this.projectsRepository.save(project);
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
