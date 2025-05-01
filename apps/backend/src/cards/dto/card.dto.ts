import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CardPanelDto {
  @ApiProperty({ example: 1, description: 'Panel number (sequential)' })
  @IsNumber()
  number!: number;

  @ApiProperty({ example: 'PS1 - Mountain Pass', description: 'Panel name/description' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 0, description: 'Finish time in milliseconds' })
  @IsNumber()
  finishTime!: number;

  @ApiProperty({ example: 34200000, description: 'Provisional start time in milliseconds' })
  @IsNumber()
  provisionalStartTime!: number;

  @ApiProperty({ example: 34200000, description: 'Actual start time in milliseconds' })
  @IsNumber()
  actualStartTime!: number;

  @ApiProperty({ example: 300000, description: 'Driving time in milliseconds' })
  @IsNumber()
  drivingTime!: number;

  @ApiProperty({ example: 0, description: 'Result time in milliseconds' })
  @IsNumber()
  resultTime!: number;

  @ApiProperty({ example: 0, description: 'Next PKC time in milliseconds' })
  @IsNumber()
  nextPKCTime!: number;

  @ApiProperty({ example: 0, description: 'Arrival time in milliseconds' })
  @IsNumber()
  arrivalTime!: number;
}

export class CardDto {
  @ApiProperty({ example: 'Rally Monte Calvaria', description: 'Name of the event/card' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1, description: 'Card number in the event' })
  @IsNumber()
  cardNumber!: number;

  @ApiProperty({ example: 69, description: 'Car number in the event' })
  @IsNumber()
  carNumber!: number;

  @ApiProperty({ example: '2025-04-26', description: 'Event date in YYYY-MM-DD format' })
  @IsString()
  date!: string;
  
  @ApiProperty({ example: 'montecalvaria.png', description: 'Logo image filename or URL' })
  @IsString()
  logo!: string;

  @ApiProperty({ example: 'pzmot.png', description: 'Sponsor logo image filename or URL' })
  @IsString()
  sponsorLogo!: string;

  @ApiProperty({ 
    type: [CardPanelDto], 
    description: 'Array of panels in the card',
    example: [{
      number: 1,
      name: '',
      finishTime: 0,
      provisionalStartTime: 34200000,
      actualStartTime: 34200000,
      drivingTime: 0,
      resultTime: 0,
      nextPKCTime: 0,
      arrivalTime: 0
    }]
  })
  @IsArray()
  panels!: CardPanelDto[];

  @ApiProperty({ 
    example: 'A description of the card', 
    description: 'Optional description',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;
}