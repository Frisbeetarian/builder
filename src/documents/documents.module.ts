import { Module } from '@nestjs/common';
import { DocumentsServiceTsService } from './documents.service.ts.service';

@Module({
  providers: [DocumentsServiceTsService],
})
export class DocumentsModule {}
