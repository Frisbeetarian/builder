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
import { ApiTags } from '@nestjs/swagger';

import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { ElementsService } from './elements.service';
import { CreateElementDto } from './dto/create-element-dto';
import { UpdateElementDto } from './dto/update-element-dto';
import { Element } from './entities/element.entity';

@ApiTags('elements')
@Controller('elements')
export class ElementsController {
  constructor(private readonly elementsService: ElementsService) {}

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.elementsService.findOne(uuid);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.elementsService.findAll(paginationQuery);
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() createElementDto: CreateElementDto): Promise<Element> {
    return this.elementsService.create(createElementDto);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateElementDto: UpdateElementDto,
  ) {
    return this.elementsService.update(uuid, updateElementDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.elementsService.remove(uuid);
  }
}
