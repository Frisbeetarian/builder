import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ description: 'The name of a project.' })
  readonly name: string;

  @ApiProperty({ example: [] })
  readonly documents: Document[];
}
