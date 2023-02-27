import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from '../../documents/entities/document.entity';
export class CreateElementDto {
  @ApiProperty({ description: 'The name of an element.' })
  readonly name: string;

  @ApiProperty({ example: [] })
  readonly documents?: Document[];
}
