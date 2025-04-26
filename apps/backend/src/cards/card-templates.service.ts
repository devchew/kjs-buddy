import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardTemplate } from './entities/card-template.entity';
import { CreateCardTemplateDto } from './dto/create-card-template.dto';
import { UpdateCardTemplateDto } from './dto/update-card-template.dto';

@Injectable()
export class CardTemplatesService {
  constructor(
    @InjectRepository(CardTemplate)
    private readonly cardTemplateRepository: Repository<CardTemplate>,
  ) {}

  async create(createCardTemplateDto: CreateCardTemplateDto, userId: string): Promise<CardTemplate> {
    const cardTemplate = this.cardTemplateRepository.create({
      ...createCardTemplateDto,
      userId,
    });
    
    return this.cardTemplateRepository.save(cardTemplate);
  }

  async findAll(): Promise<CardTemplate[]> {
    return this.cardTemplateRepository.find({
      where: { isPublic: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<CardTemplate> {
    const cardTemplate = await this.cardTemplateRepository.findOne({
      where: { id, isPublic: true },
    });

    if (!cardTemplate) {
      throw new NotFoundException(`Card template with ID ${id} not found or is not public`);
    }

    return cardTemplate;
  }

  async update(id: string, updateCardTemplateDto: UpdateCardTemplateDto, userId: string): Promise<CardTemplate> {
    const cardTemplate = await this.cardTemplateRepository.findOne({
      where: { id },
    });

    if (!cardTemplate) {
      throw new NotFoundException(`Card template with ID ${id} not found`);
    }

    if (cardTemplate.userId !== userId) {
      throw new ForbiddenException('You can only update your own card templates');
    }

    // Update the card template with new data
    Object.assign(cardTemplate, updateCardTemplateDto);

    return this.cardTemplateRepository.save(cardTemplate);
  }

  async remove(id: string, userId: string): Promise<void> {
    const cardTemplate = await this.cardTemplateRepository.findOne({
      where: { id },
    });

    if (!cardTemplate) {
      throw new NotFoundException(`Card template with ID ${id} not found`);
    }

    if (cardTemplate.userId !== userId) {
      throw new ForbiddenException('You can only delete your own card templates');
    }

    await this.cardTemplateRepository.remove(cardTemplate);
  }
}