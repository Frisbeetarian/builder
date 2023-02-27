import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsServiceTsService } from './documents.service.ts.service';

describe('DocumentsServiceTsService', () => {
  let service: DocumentsServiceTsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentsServiceTsService],
    }).compile();

    service = module.get<DocumentsServiceTsService>(DocumentsServiceTsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
