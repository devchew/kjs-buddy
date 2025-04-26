import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cards')
export class Card {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the card'
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({
    example: 'Rally Monte Calvaria',
    description: 'Name of the event/card'
  })
  @Column()
  name!: string;

  @ApiProperty({
    example: 1,
    description: 'Card number in the event'
  })
  @Column()
  cardNumber!: number;

  @ApiProperty({
    example: 69,
    description: 'Car number in the event'
  })
  @Column()
  carNumber!: number;

  @ApiProperty({
    example: '2025-04-26',
    description: 'Event date in YYYY-MM-DD format'
  })
  @Column()
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
      },
      {
        number: 2,
        name: 'PS1 - Mountain Pass',
        finishTime: 0,
        provisionalStartTime: 34200000,
        actualStartTime: 34200000,
        drivingTime: 300000,
        resultTime: 0,
        nextPKCTime: 0,
        arrivalTime: 0
      }
    ],
    description: 'Array of panels in the card'
  })
  @Column('simple-json')
  panels!: any[];  // Storing panels as JSON for flexibility

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the user who owns this card'
  })
  @Column()
  userId!: string;

  @ApiProperty({
    example: 1714201274525,
    description: 'Timestamp of when the card was last accessed'
  })
  @Column({ default: Date.now() })
  lastUsed!: number;

  @ApiProperty({
    example: '2025-04-26T12:00:00Z',
    description: 'Date and time when the card was created'
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    example: '2025-04-26T15:30:45Z',
    description: 'Date and time when the card was last updated'
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}