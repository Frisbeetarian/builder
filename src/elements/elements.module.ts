import { Module } from '@nestjs/common';
import { ElementsService } from './elements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Element } from './entities/element.entity';
import { Document } from '../documents/entities/document.entity';
import { ElementsController } from './elements.controller';
import { ElementToDocument } from '../documents/entities/elementToDocument.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Element, ElementToDocument])],
  providers: [ElementsService],
  exports: [ElementsService],
  controllers: [ElementsController],
})
export class ElementsModule {}
