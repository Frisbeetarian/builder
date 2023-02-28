import { ApiProperty } from '@nestjs/swagger';
import { Document } from '../../documents/entities/document.entity';
export class UpdateElementToDocumentDto {
  @ApiProperty({
    description:
      'The UUID of the relationship between the document and the element.',
  })
  readonly relationshipUuid: string;

  @ApiProperty({
    description: 'The UUID of the element being updated in the document.',
  })
  readonly elementUuid: string;

  @ApiProperty({
    description: 'The UUID of the document whose element is being updated.',
  })
  readonly documentUuid: string;

  @ApiProperty({
    description: 'The order of the element being updated in the document.',
  })
  readonly order: number;
}
