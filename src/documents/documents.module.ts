import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { Element } from '../elements/entities/element.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Document, Element])],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
