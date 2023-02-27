import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document-dto';
import { UpdateDocumentDto } from './dto/update-document-dto';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.documentsService.findOne(uuid);
  }
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.documentsService.findAll(paginationQuery);
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() createProjectDto: CreateDocumentDto) {
    console.log('create project dto:', createProjectDto);

    return this.documentsService.create(createProjectDto);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(uuid, updateDocumentDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.documentsService.remove(uuid);
  }
}
