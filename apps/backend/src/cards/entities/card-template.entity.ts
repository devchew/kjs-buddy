import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Card } from './card.entity';

@Entity('card_templates')
export class CardTemplate extends Card {
  @ApiProperty({
    example: true,
    description: 'Whether the template is public and accessible without authentication'
  })
  @Column({ default: false })
  isPublic!: boolean;
  
}