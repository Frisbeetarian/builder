import { Module } from '@nestjs/common';
import { ElementsService } from './elements.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Button } from './entities/button.entity';
import { Text } from './entities/text.entity';
import { Image } from './entities/image.entity';
import { Element } from './entities/element.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Element, Text, Image, Button])],
  providers: [ElementsService],
  exports: [ElementsService],
})
export class ElementsModule {}
