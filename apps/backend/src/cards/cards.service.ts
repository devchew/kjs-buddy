import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
  ) {}

  async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {
    const card = this.cardRepository.create({
      ...createCardDto,
      userId,
      lastUsed: Date.now(),
    });
    
    return this.cardRepository.save(card);
  }

  async findAll(userId: string): Promise<Card[]> {
    return this.cardRepository.find({
      where: { userId },
      order: { lastUsed: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id, userId },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    // Update the lastUsed timestamp
    card.lastUsed = Date.now();
    await this.cardRepository.save(card);

    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto, userId: string): Promise<Card> {
    const card = await this.cardRepository.findOne({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    if (card.userId !== userId) {
      throw new ForbiddenException('You can only update your own cards');
    }

    // Update the card with new data
    Object.assign(card, { 
      ...updateCardDto,
      lastUsed: Date.now()
    });

    return this.cardRepository.save(card);
  }

  async remove(id: string, userId: string): Promise<void> {
    const card = await this.cardRepository.findOne({
      where: { id },
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    if (card.userId !== userId) {
      throw new ForbiddenException('You can only delete your own cards');
    }

    await this.cardRepository.remove(card);
  }
}