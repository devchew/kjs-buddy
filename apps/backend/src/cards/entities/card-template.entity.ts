import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('card_templates')
export class CardTemplate {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the card template'
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 'Rally Monte Calvaria Template',
    description: 'Name of the card template'
  })
  @Column()
  name!: string;

  @ApiProperty({
    example: 'A template for Rally Monte Calvaria event',
    description: 'Description of the card template'
  })
  @Column({ nullable: true })
  description!: string;

  @ApiProperty({
    example: 1,
    description: 'Card number in the event'
  })
  @Column({ default: 1 })
  cardNumber!: number;

  @ApiProperty({
    example: 69,
    description: 'Car number in the event'
  })
  @Column({ default: 1 })
  carNumber!: number;

  @ApiProperty({
    example: '2025-04-26',
    description: 'Event date in YYYY-MM-DD format'
  })
  @Column({ default: '' })
  date!: string;

  @ApiProperty({
    example: 'montecalvaria.png',
    description: 'Logo image filename or URL'
  })
  @Column()
  logo!: string;

  @ApiProperty({
    example: 'pzmot.png',
    description: 'Sponsor logo image filename or URL'
  })
  @Column()
  sponsorLogo!: string;

  @ApiProperty({
    example: [
      {
        number: 1,
        name: '',
        finishTime: 0,
        provisionalStartTime: 34200000,
        actualStartTime: 34200000,
        drivingTime: 0,
        resultTime: 0,
        nextPKCTime: 0,
        arrivalTime: 0
      }
    ],
    description: 'Array of panels in the template'
  })
  @Column('simple-json')
  panels!: any[];  // Storing panels as JSON for flexibility

  @ApiProperty({
    example: true,
    description: 'Whether the template is public and accessible without authentication'
  })
  @Column({ default: false })
  isPublic!: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the user who created this template'
  })
  @Column()
  userId!: string;

  @ApiProperty({
    example: '2025-04-26T12:00:00Z',
    description: 'Date and time when the template was created'
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    example: '2025-04-26T15:30:45Z',
    description: 'Date and time when the template was last updated'
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}