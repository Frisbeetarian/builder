import { Module } from '@nestjs/common';
import { ProjectsControllerTsController } from './projects.controller.ts.controller';

@Module({
  controllers: [ProjectsControllerTsController],
})
export class ProjectsModule {}
