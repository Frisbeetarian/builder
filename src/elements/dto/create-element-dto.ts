import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from '../../documents/entities/document.entity';
export class CreateElementDto {
  @ApiProperty({ description: 'The name of an element.' })
  readonly name: string;

  @ApiProperty({
    description: 'The type of an element. Which can be text, button or image.',
  })
  readonly type: 'text' | 'button' | 'image';

  @ApiProperty({ example: [] })
  readonly documents?: Document[];
}
