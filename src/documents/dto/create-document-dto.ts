import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Project } from '../../projects/entities/project.entity';

export class CreateDocumentDto {
  @ApiProperty({ description: 'The name of a document.' })
  readonly name: string;

  @ApiProperty({ example: [] })
  @IsOptional()
  readonly projects: Project[];
}
