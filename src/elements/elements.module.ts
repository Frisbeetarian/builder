import { Module } from '@nestjs/common';
import { ElementsService } from './elements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Button } from './entities/button.entity';
import { Text } from './entities/text.entity';
import { Image } from './entities/image.entity';
import { Element } from './entities/element.entity';
import { Document } from '../documents/entities/document.entity';
import { ElementsController } from './elements.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Element, Text, Image, Button])],
  providers: [ElementsService],
  exports: [ElementsService],
  controllers: [ElementsController],
})
export class ElementsModule {}
