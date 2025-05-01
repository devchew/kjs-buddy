import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CardDto } from './card.dto';

export class CreateCardTemplateDto {
  @ApiProperty({
    example: true,
    description: 'Whether the template is public and accessible without authentication',
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({
    description: 'Card data',
    type: CardDto
  })
  card!: CardDto;
}