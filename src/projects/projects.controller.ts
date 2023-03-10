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

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':uuid')
  findOne(@Param('uuid') uuid: string) {
    return this.projectsService.findOne(uuid);
  }
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.projectsService.findAll(paginationQuery);
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(uuid, updateProjectDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.projectsService.remove(uuid);
  }
}
