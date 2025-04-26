import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCardTemplateDto {
  @ApiProperty({
    example: 'Rally Monte Calvaria Template',
    description: 'Name of the card template'
  })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'A template for Rally Monte Calvaria event',
    description: 'Description of the card template',
    required: false
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'montecalvaria.png',
    description: 'Logo image filename or URL'
  })
  @IsNotEmpty()
  @IsString()
  logo!: string;

  @ApiProperty({
    example: 'pzmot.png',
    description: 'Sponsor logo image filename or URL'
  })
  @IsNotEmpty()
  @IsString()
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
  @IsArray()
  panels!: any[];

  @ApiProperty({
    example: true,
    description: 'Whether the template is public and accessible without authentication',
    required: false,
    default: false
  })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;
}