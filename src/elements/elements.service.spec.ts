import { Test, TestingModule } from '@nestjs/testing';
import { ElementsService } from './elements.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../documents/entities/document.entity';
import { Element } from './entities/element.entity';
import { NotFoundException } from '@nestjs/common';
import { ElementToDocument } from '../documents/entities/elementToDocument.entity';
import { CreateElementDto } from './dto/create-element-dto';

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
              projects: [
                {
                  uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
                  name: 'Project 1',
                },
              ],
            },
          },
          {
            uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
            name: 'Element 2',
            document: {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Document 2',
              projects: [
                {
                  uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
                  name: 'Project 2',
                },
              ],
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
    const createElementDto: CreateElementDto = {
      name: 'Element 1',
      type: 'text' as 'text' | 'image' | 'button',
      order: 3,
    };

    const expectedElement = {
      uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
      name: 'Element 1',
      order: 3,
      type: 'text' as 'text' | 'image' | 'button',
      documents: [
        {
          uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          name: 'Document 1',
          updatedAt: new Date(),
          createdAt: new Date(),
          elementsToDocuments: [
            {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              order: 3,
              elementUuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              documentUuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              updatedAt: new Date(),
              createdAt: new Date(),
            },
          ],
          projects: [
            {
              uuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
              name: 'Project 1',
            },
          ],
        },
      ],
    };

    const createdAssociation = {
      order: 1,
      elementUuid: 'element-uuid',
      documentUuid: 'document-uuid',
    };

    it('should create a new element and its association with a document', async () => {
      elementsRepository.save.mockResolvedValue(expectedElement);
      elementsRepository.create.mockReturnValue(createdAssociation);
      elementsRepository.save.mockResolvedValue(undefined);

      const result = await service.create(createElementDto);

      expect(elementsRepository.save).toHaveBeenCalledWith(createElementDto);
      expect(elementsRepository.create).toHaveBeenCalledWith(
        createdAssociation,
      );
      expect(elementsRepository.save).toHaveBeenCalledWith(createdAssociation);
      expect(result).toEqual(expectedElement);
    });

    it('should throw an error if any error occurs during creation', async () => {
      const errorMessage = 'Internal server error';
      elementsRepository.save.mockRejectedValue(new Error(errorMessage));

      await expect(service.create(createElementDto)).rejects.toThrow(
        errorMessage,
      );
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
        const assignElementToDocumentDto = {
          elementUuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          documentUuid: '9778d4f2-8db8-4b01-9196-73422385dfb2',
          order: 3,
        };

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

        elementsRepository.preload.mockResolvedValue(expectedElement);
        elementsRepository.save.mockResolvedValue(expectedElement);
        const element = await service.assignElementToDocument(
          assignElementToDocumentDto,
        );
        expect(element).toEqual(expectedElement);
      });
    });
    describe('when element with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const assignElementToDocumentDto = {
          elementUuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          documentUuid: '9778d4f2-8db8-4b01-9196-73422385dfb2',
          order: 3,
        };

        elementsRepository.preload.mockResolvedValue(undefined);
        await expect(
          service.assignElementToDocument(assignElementToDocumentDto),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('updateElementInDocument', () => {
    describe('when element with UUID exists', () => {
      it('should update an element in a document', async () => {
        const uuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';

        const updateElementInDocumentDto = {
          relationshipUuid: '9778d2f2-8db8-4b01-9196-73422385ddb2',
          elementUuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          documentUuid: '9778d4f2-8db8-4b01-9196-73422385dfb2',
          order: 3,
        };

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

        elementsRepository.preload.mockResolvedValue(expectedElement);
        elementsRepository.save.mockResolvedValue(expectedElement);
        const element = await service.updateElementInDocument(
          updateElementInDocumentDto,
        );
        expect(element).toEqual(expectedElement);
      });
    });
    describe('when element with UUID does not exist', () => {
      it('should throw a NotFoundException', async () => {
        const updateElementInDocumentDto = {
          relationshipUuid: '9778d2f2-8db8-4b01-9196-73422385ddb2',
          elementUuid: '9778d4f2-8db8-4b01-9196-73422385ddb2',
          documentUuid: '9778d4f2-8db8-4b01-9196-73422385dfb2',
          order: 3,
        };

        elementsRepository.preload.mockResolvedValue(undefined);

        await expect(
          service.updateElementInDocument(updateElementInDocumentDto),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });

  describe('removeElementFromDocument', () => {
    describe('when element with UUID exists', () => {
      it('should remove an element from a document', async () => {
        const relationshipUuid = '9778d4f2-8db8-4b01-9196-73422385ddb2';

        const expectedRelationship = {
          uuid: relationshipUuid,
          elementUuid: '',
          documentUuid: '',
          order: 0,
        };

        elementsRepository.preload.mockResolvedValue(expectedRelationship);
        elementsRepository.save.mockResolvedValue(expectedRelationship);
        const element = await service.removeElementFromDocument(
          relationshipUuid,
        );
        expect(element).toEqual(true);
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
