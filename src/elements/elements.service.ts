import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Document } from '../documents/entities/document.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Element } from './entities/element.entity';
import { CreateElementDto } from './dto/create-element-dto';
import { UpdateElementDto } from './dto/update-element-dto';

@Injectable()
export class ElementsService {
  constructor(
    @InjectRepository(Element)
    private readonly elementsRepository: Repository<Element>,

    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,

    private readonly dataSource: DataSource,
  ) {}

  async findOne(uuid: string) {
    const element = await this.elementsRepository.findOne({
      where: { uuid: uuid },
      relations: ['documents'],
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

  async create(createElementDto: CreateElementDto) {
    const element = this.elementsRepository.create({
      ...createElementDto,
    });

    return this.elementsRepository.save(element);
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
      documents,
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
