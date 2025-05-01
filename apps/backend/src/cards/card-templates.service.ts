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
      name: createCardTemplateDto.card.name,
      description: createCardTemplateDto.card.description || '',
      logo: createCardTemplateDto.card.logo,
      sponsorLogo: createCardTemplateDto.card.sponsorLogo,
      panels: createCardTemplateDto.card.panels,
      cardNumber: createCardTemplateDto.card.cardNumber,
      carNumber: createCardTemplateDto.card.carNumber,
      date: createCardTemplateDto.card.date,
      isPublic: createCardTemplateDto.isPublic || false,
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
    if (updateCardTemplateDto.isPublic !== undefined) {
      cardTemplate.isPublic = updateCardTemplateDto.isPublic;
    }
    
    if (updateCardTemplateDto.card) {
      if (updateCardTemplateDto.card.name) cardTemplate.name = updateCardTemplateDto.card.name;
      if (updateCardTemplateDto.card.description !== undefined) cardTemplate.description = updateCardTemplateDto.card.description || '';
      if (updateCardTemplateDto.card.logo) cardTemplate.logo = updateCardTemplateDto.card.logo;
      if (updateCardTemplateDto.card.sponsorLogo) cardTemplate.sponsorLogo = updateCardTemplateDto.card.sponsorLogo;
      if (updateCardTemplateDto.card.panels) cardTemplate.panels = updateCardTemplateDto.card.panels;
      if (updateCardTemplateDto.card.cardNumber) cardTemplate.cardNumber = updateCardTemplateDto.card.cardNumber;
      if (updateCardTemplateDto.card.carNumber) cardTemplate.carNumber = updateCardTemplateDto.card.carNumber;
      if (updateCardTemplateDto.card.date) cardTemplate.date = updateCardTemplateDto.card.date;
    }

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