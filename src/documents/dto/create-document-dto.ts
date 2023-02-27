import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Project } from '../../projects/entities/project.entity';
import { Element } from '../../elements/entities/element.entity';

export class CreateDocumentDto {
  @ApiProperty({ description: 'The name of a document.' })
  readonly name: string;

  @ApiProperty({ example: [] })
  readonly projects: Project[];

  @ApiProperty({ example: [] })
  @IsOptional()
  readonly elements?: Element[];
}
