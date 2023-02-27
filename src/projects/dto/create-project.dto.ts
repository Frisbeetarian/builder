import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from '../../documents/entities/document.entity';

export class CreateProjectDto {
  @ApiProperty({ description: 'The name of a project.' })
  readonly name: string;

  @ApiProperty({ example: [] })
  @IsOptional()
  readonly documents: Document[];
}
