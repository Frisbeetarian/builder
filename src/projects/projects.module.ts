import { Module } from '@nestjs/common';
import { ProjectsControllerTsController } from './projects.controller.ts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Project } from './entities/project.entity';
import { Document } from '../documents/entities/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Document])],
  controllers: [ProjectsControllerTsController],
})
export class ProjectsModule {}
