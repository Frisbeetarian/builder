import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from '../../src/projects/projects.module';
import * as request from 'supertest';
import { CreateProjectDto } from '../../src/projects/dto/create-project.dto';

describe('[Feature] Projects - /projects', () => {
  const project = {
    name: 'Project 1',
    documents: [],
  };

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ProjectsModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: 5433,
          username: 'postgres',
          password: 'password',
          database: process.env.DATABASE_NAME,
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Create [POST /]', () => {
    return request(app.getHttpServer())
      .post('/projects')
      .send(project as CreateProjectDto)
      .expect(HttpStatus.CREATED)
      .then(({ body }) => {
        const expectedProject = jasmine.objectContaining({
          ...project,
          documents: jasmine.arrayContaining(
            project.documents.map((document) =>
              jasmine.objectContaining({ document }),
            ),
          ),
        });
        expect(body).toEqual(expectedProject);
      });
  });

  it.todo('Get all [GET /]');
  it.todo('Get one [GET /:uuid]');
  it.todo('Update one [PATCH /:uuid]');
  it.todo('Delete one [DELETE /:uuid]');

  afterEach(async () => {
    await app.close();
  });
});
