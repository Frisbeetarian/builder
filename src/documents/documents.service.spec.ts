import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { Element } from '../elements/entities/element.entity';
import { Document } from './entities/document.entity';
import { NotFoundException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('DocumentsService', () => {
  let service: DocumentsService;
  let documentRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Document),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Element),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Project),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    documentRepository = module.get<MockRepository>(
      getRepositoryToken(Document),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when document with UUID exists', () => {
      it('should return a document', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';

        const expectedDocument = {
          uuid,
          elementToDocuments: [],
          elements: [],
          projects: [],
        };

        documentRepository.findOne.mockReturnValue(expectedDocument);
        const document = await service.findOne(uuid);
        expect(document).toEqual(expectedDocument);
      });
    });

    describe('when document with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        documentRepository.findOne.mockReturnValue(undefined);

        try {
          await service.findOne('uuid');
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`Document #uuid not found`);
        }
      });
    });
  });
});
