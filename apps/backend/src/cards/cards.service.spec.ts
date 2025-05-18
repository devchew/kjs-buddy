import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardsService } from './cards.service';
import { Card } from './entities/card.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CardsService', () => {
  let service: CardsService;
  let repository: Repository<Card>;

  const mockCardsRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getRepositoryToken(Card),
          useValue: mockCardsRepository,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    repository = module.get<Repository<Card>>(getRepositoryToken(Card));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cards belonging to a user', async () => {
      const userId = '1';
      const expectedCards = [
        { id: '1', name: 'Card 1', userId },
        { id: '2', name: 'Card 2', userId },
      ];

      mockCardsRepository.find.mockResolvedValue(expectedCards);

      const result = await service.findAll(userId);

      expect(result).toEqual(expectedCards);
      expect(mockCardsRepository.find).toHaveBeenCalledWith({
        where: { userId },
        order: { lastUsed: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a specific card by ID and user ID', async () => {
      const cardId = '1';
      const userId = '1';
      const expectedCard = {
        id: cardId,
        name: 'Card 1',
        userId,
        lastUsed: 1234567890,
      };

      mockCardsRepository.findOne.mockResolvedValue(expectedCard);
      mockCardsRepository.save.mockResolvedValue({
        ...expectedCard,
        lastUsed: expect.any(Number),
      });

      const result = await service.findOne(cardId, userId);

      expect(result).toEqual({ ...expectedCard, lastUsed: expect.any(Number) });
      expect(mockCardsRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId, userId },
      });
      expect(mockCardsRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if card not found', async () => {
      const cardId = '999';
      const userId = '1';

      mockCardsRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(cardId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCardsRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId, userId },
      });
      expect(mockCardsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new card', async () => {
      const userId = '1';
      const createCardDto = {
        name: 'New Card',
        cardNumber: 5,
        date: '2023-01-01',
        carNumber: 69,
        logo: 'logo.png',
        sponsorLogo: 'sponsor.png',
        panels: [
          {
            number: 1,
            name: 'Panel 1',
            finishTime: 0,
            provisionalStartTime: 34200000,
            actualStartTime: 34200000,
            drivingTime: 300000,
            resultTime: 0,
            nextPKCTime: 0,
            arrivalTime: 0,
          },
        ],
      };
      const newCard = {
        id: '1',
        ...createCardDto,
        userId,
        lastUsed: expect.any(Number),
      };

      mockCardsRepository.create.mockReturnValue(newCard);
      mockCardsRepository.save.mockResolvedValue(newCard);

      const result = await service.create(createCardDto, userId);

      expect(result).toEqual(newCard);
      expect(mockCardsRepository.create).toHaveBeenCalledWith({
        ...createCardDto,
        userId,
        lastUsed: expect.any(Number),
      });
      expect(mockCardsRepository.save).toHaveBeenCalledWith(newCard);
    });
  });

  describe('update', () => {
    it('should update and return a card', async () => {
      const cardId = '1';
      const userId = '1';
      const updateCardDto = { name: 'Updated Card' };
      const existingCard = {
        id: cardId,
        name: 'Original Card',
        userId,
        lastUsed: 1234567890,
      };
      const updatedCard = {
        ...existingCard,
        ...updateCardDto,
        lastUsed: expect.any(Number),
      };

      mockCardsRepository.findOne.mockResolvedValue(existingCard);
      mockCardsRepository.save.mockResolvedValue(updatedCard);

      const result = await service.update(cardId, updateCardDto, userId);

      expect(result).toEqual(updatedCard);
      expect(mockCardsRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(mockCardsRepository.save).toHaveBeenCalledWith({
        ...existingCard,
        ...updateCardDto,
        lastUsed: expect.any(Number),
      });
    });

    it('should throw NotFoundException if card not found', async () => {
      const cardId = '999';
      const userId = '1';
      const updateCardDto = { name: 'Updated Card' };

      mockCardsRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(cardId, updateCardDto, userId),
      ).rejects.toThrow(NotFoundException);
      expect(mockCardsRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(mockCardsRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const cardId = '1';
      const userId = '1';
      const wrongUserId = '2';
      const updateCardDto = { name: 'Updated Card' };
      const existingCard = {
        id: cardId,
        name: 'Original Card',
        userId,
      };

      mockCardsRepository.findOne.mockResolvedValue(existingCard);

      await expect(
        service.update(cardId, updateCardDto, wrongUserId),
      ).rejects.toThrow(ForbiddenException);
      expect(mockCardsRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(mockCardsRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a card', async () => {
      const cardId = '1';
      const userId = '1';
      const existingCard = {
        id: cardId,
        name: 'Card to delete',
        userId,
      };

      mockCardsRepository.findOne.mockResolvedValue(existingCard);
      mockCardsRepository.remove.mockResolvedValue(existingCard);

      await service.remove(cardId, userId);

      expect(mockCardsRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(mockCardsRepository.remove).toHaveBeenCalledWith(existingCard);
    });

    it('should throw NotFoundException if card not found', async () => {
      const cardId = '999';
      const userId = '1';

      mockCardsRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(cardId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCardsRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(mockCardsRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const cardId = '1';
      const userId = '1';
      const wrongUserId = '2';
      const existingCard = {
        id: cardId,
        name: 'Card to delete',
        userId,
      };

      mockCardsRepository.findOne.mockResolvedValue(existingCard);

      await expect(service.remove(cardId, wrongUserId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockCardsRepository.findOne).toHaveBeenCalledWith({
        where: { id: cardId },
      });
      expect(mockCardsRepository.remove).not.toHaveBeenCalled();
    });
  });
});
