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
  find: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
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
          await service.findOne(uuid);
        } catch (error) {
          expect(error).toBeInstanceOf(NotFoundException);
          expect(error.message).toEqual(`Document #${uuid} not found`);
        }
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of documents', async () => {
      const expectedDocuments = [
        {
          uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          elementToDocuments: [],
          elements: [],
          projects: [],
        },
        {
          uuid: '9778d4f2-8db8-4b01-9196-73422385ddb3',
          elementToDocuments: [],
          elements: [],
          projects: [],
        },
      ];

      documentRepository.find.mockReturnValue(expectedDocuments);
      const documents = await service.findAll({ limit: 10, offset: 0 });
      expect(documents).toEqual(expectedDocuments);
    });
  });

  describe('create', () => {
    it('should create a document', async () => {
      const createDocumentDto = {
        uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
        name: 'test document',
        elements: [],
        projects: [],
      };

      documentRepository.create.mockReturnValue(createDocumentDto);
      documentRepository.save.mockReturnValue(createDocumentDto);
      const document = await service.create(createDocumentDto);
      expect(document).toEqual(createDocumentDto);
    });
  });

  describe('update', () => {
    describe('when document with UUID exists', () => {
      it('should update document with valid UUID and DTO', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';

        const updateDocumentDto = {
          uuid,
          name: 'test document',
          elementToDocuments: [],
          elements: [],
          projects: [],
        };

        const projectMocks = [];
        documentRepository.preload.mockResolvedValueOnce(updateDocumentDto);
        documentRepository.save.mockResolvedValueOnce(updateDocumentDto);
        service.preloadProjectByUuid = jest
          .fn()
          .mockImplementation((uuid: string) => {
            return Promise.resolve(projectMocks.find((p) => p.uuid === uuid));
          });

        const result = await service.update(uuid, updateDocumentDto);

        expect(documentRepository.preload).toHaveBeenCalledWith({
          uuid,
          ...updateDocumentDto,
          projects: projectMocks,
        });

        expect(documentRepository.save).toHaveBeenCalledWith(updateDocumentDto);
        expect(result).toEqual(updateDocumentDto);
      });

      describe('when document with UUID does not exist', () => {
        it('should throw a NotFoundException', async () => {
          const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
          const updateDocumentDto = {
            uuid,
            name: 'test document',
            elementToDocuments: [],
            elements: [],
            projects: [],
          };
          documentRepository.preload.mockResolvedValueOnce(null);

          await expect(service.update(uuid, updateDocumentDto)).rejects.toThrow(
            new NotFoundException(`Document #${uuid} not found`),
          );
          documentRepository.preload.mockResolvedValueOnce(null);

          await expect(service.update(uuid, updateDocumentDto)).rejects.toThrow(
            new NotFoundException(`Document #${uuid} not found`),
          );
        });
      });
    });
  });

  describe('remove', () => {
    describe('when document with UUID exists', () => {
      it('should remove a document', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        const expectedDocument = {
          uuid,
          name: 'test document',
          elementToDocuments: [],
          elements: [],
          projects: [],
        };

        documentRepository.findOne.mockReturnValue(expectedDocument);
        documentRepository.delete.mockReturnValue(expectedDocument);
        const document = await service.remove(uuid);
        // expect(document).toEqual(expectedDocument);
      });
    });
  });
});
