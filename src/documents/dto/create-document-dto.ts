import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Project } from '../../projects/entities/project.entity';
import { Element } from '../../elements/entities/element.entity';

export class CreateDocumentDto {
  @ApiProperty({ description: 'The name of a document.' })
  readonly name: string;

  @ApiProperty({ example: [Project] })
  readonly projects: Project[];

  @ApiProperty({ example: [Element] })
  @IsOptional()
  readonly elements?: Element[];
}
