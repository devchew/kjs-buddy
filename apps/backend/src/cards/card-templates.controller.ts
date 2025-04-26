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
  BadRequestException,
  HttpCode
} from '@nestjs/common';
import { CardTemplatesService } from './card-templates.service';
import { CreateCardTemplateDto } from './dto/create-card-template.dto';
import { UpdateCardTemplateDto } from './dto/update-card-template.dto';
import { JwtAuthGuard } from '../users/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { CardTemplate } from './entities/card-template.entity';

@ApiTags('card-templates')
@Controller('cards/templates')
export class CardTemplatesController {
  constructor(private readonly cardTemplatesService: CardTemplatesService) {}


  @Get("/all")
  @ApiOperation({ 
    summary: 'Get all public card templates', 
    description: 'Retrieves all card templates flagged as public' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns an array of public card templates',
    type: [CardTemplate]
  })
  findAll() {
    return this.cardTemplatesService.findAll();
  }


  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create new card template',
    description: 'Creates a new card template for the authenticated user' 
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The card template has been successfully created',
    type: CardTemplate
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'User is not authenticated' 
  })
  create(@Body() createCardTemplateDto: CreateCardTemplateDto, @Request() req) {
    // Ensure the user ID is available from the request
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User ID not found in request. Authentication may be misconfigured.');
    }
    
    return this.cardTemplatesService.create(createCardTemplateDto, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get card template by ID',
    description: 'Retrieves a specific public card template by its ID' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the card template to retrieve',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the requested public card template',
    type: CardTemplate
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Card template not found or is not public' 
  })
  findOne(@Param('id') id: string) {
    return this.cardTemplatesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update card template',
    description: 'Updates a specific card template by its ID (owner only)' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the card template to update',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000'  
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The card template has been successfully updated',
    type: CardTemplate
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Card template not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'User does not have permission to update this card template' 
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
    @Body() updateCardTemplateDto: UpdateCardTemplateDto,
    @Request() req
  ) {
    // Ensure the user ID is available from the request
    if (!req.user || !req.user.userId) {
      throw new BadRequestException('User ID not found in request. Authentication may be misconfigured.');
    }
    
    return this.cardTemplatesService.update(id, updateCardTemplateDto, req.user.userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete card template',
    description: 'Deletes a specific card template by its ID (owner only)' 
  })
  @ApiParam({ 
    name: 'id', 
    description: 'The ID of the card template to delete',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000' 
  })
  @ApiResponse({ 
    status: HttpStatus.NO_CONTENT, 
    description: 'The card template has been successfully deleted' 
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Card template not found' 
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'User does not have permission to delete this card template' 
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
    
    return this.cardTemplatesService.remove(id, req.user.userId);
  }
}