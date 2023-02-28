import { Test, TestingModule } from '@nestjs/testing';
import { ElementsService } from './elements.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../documents/entities/document.entity';
import { Element } from './entities/element.entity';
import { NotFoundException } from '@nestjs/common';
import { ElementToDocument } from '../documents/entities/elementToDocument.entity';

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

describe('ElementsService', () => {
  let service: ElementsService;
  let elementsRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElementsService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Element),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Document),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(ElementToDocument),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ElementsService>(ElementsService);
    elementsRepository = module.get<MockRepository>(
      getRepositoryToken(Element),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    describe('when element with UUID exists', () => {
      it('should return an element', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        const expectedElement = {
          uuid,
          name: 'Element 1',
          document: {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Document 1',
            projects: [
              {
                uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
                name: 'Project 1',
              },
            ],
          },
        };
        elementsRepository.findOne.mockResolvedValue(expectedElement);
        const element = await service.findOne(uuid);
        expect(element).toEqual(expectedElement);
      });
    });
    describe('when element with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        elementsRepository.findOne.mockResolvedValue(undefined);
        await expect(service.findOne(uuid)).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('findAll', () => {
    describe('when elements exist', () => {
      it('should return an array of elements', async () => {
        const expectedElements = [
          {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Element 1',
            document: {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Document 1',
              project: {
                uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
                name: 'Project 1',
              },
            },
          },
          {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Element 2',
            document: {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Document 2',
              project: {
                uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
                name: 'Project 2',
              },
            },
          },
        ];
        elementsRepository.find.mockResolvedValue(expectedElements);
        const elements = await service.findAll({ limit: 10, offset: 0 });
        expect(elements).toEqual(expectedElements);
      });
    });
    describe('when elements do not exist', () => {
      it('should return an empty array', async () => {
        elementsRepository.find.mockResolvedValue([]);
        const elements = await service.findAll({ limit: 10, offset: 0 });
        expect(elements).toEqual([]);
      });
    });
  });

  describe('create', () => {
    it('should create an element', async () => {
      const createElementDto = {
        uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
        name: 'Element 1',
        order: 3,
        type: 'text' as 'text' | 'image' | 'button',
        document: {
          uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          name: 'Document 1',
          projects: [
            {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Project 1',
            },
          ],
        },
      };
      elementsRepository.create.mockReturnValue(createElementDto);
      elementsRepository.save.mockResolvedValue(createElementDto);
      const element = await service.create(createElementDto);
      expect(element).toEqual(createElementDto);
    });
  });

  describe('update', () => {
    describe('when element with UUID exists', () => {
      it('should update an element', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        const updateDocumentDto = {
          uuid,
          name: 'Element 1',
          order: 5,
          document: {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Document 1',
            projects: [
              {
                uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
                name: 'Project 1',
              },
            ],
          },
        };
        elementsRepository.preload.mockResolvedValue(updateDocumentDto);
        elementsRepository.save.mockResolvedValue(updateDocumentDto);
        const element = await service.update(uuid, updateDocumentDto);
        expect(element).toEqual(updateDocumentDto);
      });
    });
    describe('when element with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        elementsRepository.preload.mockResolvedValue(undefined);
        await expect(service.update(uuid, {})).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('remove', () => {
    describe('when element with UUID exists', () => {
      it('should remove an element', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        const expectedElement = {
          uuid,
          name: 'Element 1',
          document: {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Document 1',
            project: {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Project 1',
            },
          },
        };
        elementsRepository.findOne.mockResolvedValue(expectedElement);
        elementsRepository.remove.mockResolvedValue(expectedElement);
        const element = await service.remove(uuid);
        expect(element).toEqual(expectedElement);
      });
    });
    describe('when element with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        elementsRepository.findOne.mockResolvedValue(undefined);
        await expect(service.remove(uuid)).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('assignElementToDocument', () => {
    describe('when element with UUID exists', () => {
      it('should assign an element to a document', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        const expectedElement = {
          uuid,
          name: 'Element 1',
          document: {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Document 1',
            project: {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Project 1',
            },
          },
        };
        const expectedDocument = {
          uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          name: 'Document 1',
          project: {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Project 1',
          },
        };
        elementsRepository.preload.mockResolvedValue(expectedElement);
        elementsRepository.save.mockResolvedValue(expectedElement);
        const element = await service.assignElementToDocument(
          uuid,
          expectedDocument,
        );
        expect(element).toEqual(expectedElement);
      });
    });
    describe('when element with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        elementsRepository.preload.mockResolvedValue(undefined);
        await expect(service.assignElementToDocument(uuid, {})).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('updateElementInDocument', () => {
    describe('when element with UUID exists', () => {
      it('should update an element in a document', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        const expectedElement = {
          uuid,
          name: 'Element 1',
          document: {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Document 1',
            project: {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Project 1',
            },
          },
        };
        const expectedDocument = {
          uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          name: 'Document 1',
          project: {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Project 1',
          },
        };
        elementsRepository.preload.mockResolvedValue(expectedElement);
        elementsRepository.save.mockResolvedValue(expectedElement);
        const element = await service.updateElementInDocument(
          uuid,
          expectedDocument,
        );
        expect(element).toEqual(expectedElement);
      });
    });
    describe('when element with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        elementsRepository.preload.mockResolvedValue(undefined);
        await expect(service.updateElementInDocument(uuid, {})).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });

  describe('removeElementFromDocument', () => {
    describe('when element with UUID exists', () => {
      it('should remove an element from a document', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        const expectedElement = {
          uuid,
          name: 'Element 1',
          document: {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Document 1',
            projects: [
              {
                uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
                name: 'Project 1',
              },
            ],
          },
        };
        const expectedDocument = {
          uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          name: 'Document 1',
          projects: [
            {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Project 1',
            },
          ],
        };
        elementsRepository.preload.mockResolvedValue(expectedElement);
        elementsRepository.save.mockResolvedValue(expectedElement);
        const element = await service.removeElementFromDocument(
          uuid,
          expectedDocument,
        );
        expect(element).toEqual(expectedElement);
      });
    });

    describe('when element with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';
        elementsRepository.preload.mockResolvedValue(undefined);
        await expect(service.removeElementFromDocument(uuid)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
