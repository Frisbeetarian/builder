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
import { UpdateCoffeeDto } from '../coffees/dto/update-coffee.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get(':uuid')
  findOne(@Param('uuid') uuid: number) {
    return this.projectsService.findOne(uuid);
  }
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.projectsService.findAll(paginationQuery);
  }

  @Post()
  @HttpCode(HttpStatus.GONE)
  create(@Body() createProjectDto: CreateProjectDto) {
    console.log('create project dto:', createProjectDto);

    return this.projectsService.create(createProjectDto);
  }

  @Patch(':uuid')
  update(
    @Param('uuid') uuid: string,
    @Body() updateCoffeeDto: UpdateCoffeeDto,
  ) {
    return this.projectsService.update(uuid, updateCoffeeDto);
  }

  @Delete(':uuid')
  remove(@Param('uuid') uuid: string) {
    return this.projectsService.remove(uuid);
  }
}
