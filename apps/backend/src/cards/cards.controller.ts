import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Put, 
  UseGuards,
  Request,
  HttpStatus,
  BadRequestException 
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { Card } from './entities/card.entity';

@ApiTags('cards')
@ApiBearerAuth('JWT-auth') // Using the same name as defined in main.ts
@Controller('cards')
@UseGuards(JwtAuthGuard) // Require authentication for all endpoints in this controller
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create new card',
    description: 'Creates a new rally card for the authenticated user' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The card has been successfully created',
    type: Card
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'User is not authenticated' 
  })
  create(@Body() createCardDto: CreateCardDto, @Request() req) {
    // Ensure the user ID is available from the request
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User ID not found in request. Authentication may be misconfigured.');
    }
    
    return this.cardsService.create(createCardDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all cards', 
    description: 'Retrieves all cards belonging to the authenticated user' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns an array of cards',
    type: [Card]
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'User is not authenticated' 
  })
  findAll(@Request() req) {
    // Ensure the user ID is available from the request
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User ID not found in request. Authentication may be misconfigured.');
    }
    
    return this.cardsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get card by ID',
    description: 'Retrieves a specific card by its ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the card to retrieve',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the requested card',
    type: Card
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Card not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'User is not authenticated' 
  })
  findOne(@Param('id') id: string, @Request() req) {
    // Ensure the user ID is available from the request
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User ID not found in request. Authentication may be misconfigured.');
    }
    
    return this.cardsService.findOne(id, req.user.userId);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update card',
    description: 'Updates a specific card by its ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the card to update',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000'  
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The card has been successfully updated',
    type: Card
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Card not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'User does not have permission to update this card' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'User is not authenticated' 
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  update(
    @Param('id') id: string, 
    @Body() updateCardDto: UpdateCardDto,
    @Request() req
  ) {
    // Ensure the user ID is available from the request
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User ID not found in request. Authentication may be misconfigured.');
    }
    
    return this.cardsService.update(id, updateCardDto, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete card',
    description: 'Deletes a specific card by its ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the card to delete',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'The card has been successfully deleted' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Card not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'User does not have permission to delete this card' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'User is not authenticated' 
  })
  remove(@Param('id') id: string, @Request() req) {
    // Ensure the user ID is available from the request
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User ID not found in request. Authentication may be misconfigured.');
    }
    
    return this.cardsService.remove(id, req.user.userId);
  }
}