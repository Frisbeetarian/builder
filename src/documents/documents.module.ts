import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { Element } from '../elements/entities/element.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsController } from './documents.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Element])],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
