import { ApiProperty } from '@nestjs/swagger';
export class AssignElementToDocumentDto {
  @ApiProperty({
    description: 'The UUID of the element being assigned to the document.',
  })
  readonly elementUuid: string;

  @ApiProperty({
    description: 'The UUID of the document being populated with an element.',
  })
  readonly documentUuid: string;

  @ApiProperty({
    description: 'The order of the element being assigned to the document.',
  })
  readonly order: number;
}
