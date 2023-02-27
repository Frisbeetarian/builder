import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsControllerTsController } from './projects.controller.ts.controller';

describe('ProjectsControllerTsController', () => {
  let controller: ProjectsControllerTsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsControllerTsController],
    }).compile();

    controller = module.get<ProjectsControllerTsController>(ProjectsControllerTsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
