import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardTemplatesService } from './card-templates.service';
import { CardTemplate } from './entities/card-template.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('CardTemplatesService', () => {
  let service: CardTemplatesService;
  let repository: Repository<CardTemplate>;

  const mockCardTemplatesRepository = {
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
        CardTemplatesService,
        {
          provide: getRepositoryToken(CardTemplate),
          useValue: mockCardTemplatesRepository,
        },
      ],
    }).compile();

    service = module.get<CardTemplatesService>(CardTemplatesService);
    repository = module.get<Repository<CardTemplate>>(
      getRepositoryToken(CardTemplate),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of public card templates', async () => {
      const expectedTemplates = [
        { id: '1', name: 'Template 1', isPublic: true, userId: '1' },
        { id: '2', name: 'Template 2', isPublic: true, userId: '2' },
      ];

      mockCardTemplatesRepository.find.mockResolvedValue(expectedTemplates);

      const result = await service.findAll();

      expect(result).toEqual(expectedTemplates);
      expect(mockCardTemplatesRepository.find).toHaveBeenCalledWith({
        where: { isPublic: true },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a public card template by ID', async () => {
      const templateId = '1';
      const expectedTemplate = {
        id: templateId,
        name: 'Public Template',
        isPublic: true,
        userId: '1',
      };

      mockCardTemplatesRepository.findOne.mockResolvedValue(expectedTemplate);

      const result = await service.findOne(templateId);

      expect(result).toEqual(expectedTemplate);
      expect(mockCardTemplatesRepository.findOne).toHaveBeenCalledWith({
        where: { id: templateId, isPublic: true },
      });
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '999';

      mockCardTemplatesRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(templateId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCardTemplatesRepository.findOne).toHaveBeenCalledWith({
        where: { id: templateId, isPublic: true },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new card template', async () => {
      const userId = '1';
      const createTemplateDto = {
        isPublic: true,
        card: {
          name: 'New Template',
          description: 'Description',
          cardNumber: 1,
          carNumber: 69,
          date: '2025-04-26',
          panels: [
            {
              number: 1,
              name: 'Panel 1',
              finishTime: 0,
              provisionalStartTime: 34200000,
              actualStartTime: 34200000,
              drivingTime: 0,
              resultTime: 0,
              nextPKCTime: 0,
              arrivalTime: 0,
            },
          ],
          logo: 'logo.png',
          sponsorLogo: 'sponsor.png',
        },
      };

      const newTemplate = {
        id: '1',
        name: createTemplateDto.card.name,
        description: createTemplateDto.card.description,
        cardNumber: createTemplateDto.card.cardNumber,
        carNumber: createTemplateDto.card.carNumber,
        date: createTemplateDto.card.date,
        panels: createTemplateDto.card.panels,
        logo: createTemplateDto.card.logo,
        sponsorLogo: createTemplateDto.card.sponsorLogo,
        isPublic: createTemplateDto.isPublic,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCardTemplatesRepository.create.mockReturnValue(newTemplate);
      mockCardTemplatesRepository.save.mockResolvedValue(newTemplate);

      const result = await service.create(createTemplateDto, userId);

      expect(result).toEqual(newTemplate);
      expect(mockCardTemplatesRepository.create).toHaveBeenCalledWith({
        name: createTemplateDto.card.name,
        description: createTemplateDto.card.description,
        cardNumber: createTemplateDto.card.cardNumber,
        carNumber: createTemplateDto.card.carNumber,
        date: createTemplateDto.card.date,
        panels: createTemplateDto.card.panels,
        logo: createTemplateDto.card.logo,
        sponsorLogo: createTemplateDto.card.sponsorLogo,
        isPublic: createTemplateDto.isPublic,
        userId,
      });
      expect(mockCardTemplatesRepository.save).toHaveBeenCalledWith(
        newTemplate,
      );
    });
  });

  describe('update', () => {
    it('should update and return a card template', async () => {
      const templateId = '1';
      const userId = '1';
      const updateTemplateDto = {
        isPublic: true,
        card: {
          name: 'Updated Template',
          description: 'Updated Description',
          cardNumber: 1,
          carNumber: 69,
          date: '2025-04-26',
          logo: 'logo.png',
          sponsorLogo: 'sponsor.png',
          panels: [],
        },
      };
      const existingTemplate = {
        id: templateId,
        name: 'Original Template',
        description: 'Description',
        cardNumber: 1,
        carNumber: 69,
        date: '2025-04-26',
        logo: 'logo.png',
        sponsorLogo: 'sponsor.png',
        isPublic: false,
        userId,
        panels: [],
      };

      const updatedTemplate = {
        ...existingTemplate,
        name: updateTemplateDto.card.name,
        description: updateTemplateDto.card.description,
        isPublic: updateTemplateDto.isPublic,
      };

      mockCardTemplatesRepository.findOne.mockResolvedValue(existingTemplate);
      mockCardTemplatesRepository.save.mockResolvedValue(updatedTemplate);

      const result = await service.update(
        templateId,
        updateTemplateDto,
        userId,
      );

      expect(result).toEqual(updatedTemplate);
      expect(mockCardTemplatesRepository.findOne).toHaveBeenCalledWith({
        where: { id: templateId },
      });
      expect(mockCardTemplatesRepository.save).toHaveBeenCalledWith(
        updatedTemplate,
      );
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '999';
      const userId = '1';
      const updateTemplateDto = {
        isPublic: true,
        card: {
          name: 'Updated Template',
          description: 'Updated Description',
          cardNumber: 1,
          carNumber: 69,
          date: '2025-04-26',
          logo: 'logo.png',
          sponsorLogo: 'sponsor.png',
          panels: [],
        },
      };

      mockCardTemplatesRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(templateId, updateTemplateDto, userId),
      ).rejects.toThrow(NotFoundException);
      expect(mockCardTemplatesRepository.findOne).toHaveBeenCalledWith({
        where: { id: templateId },
      });
      expect(mockCardTemplatesRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const templateId = '1';
      const userId = '1';
      const wrongUserId = '2';
      const updateTemplateDto = {
        isPublic: true,
        card: {
          name: 'Updated Template',
          description: 'Updated Description',
          cardNumber: 1,
          carNumber: 69,
          date: '2025-04-26',
          logo: 'logo.png',
          sponsorLogo: 'sponsor.png',
          panels: [],
        },
      };
      const existingTemplate = {
        id: templateId,
        name: 'Original Template',
        description: 'Description',
        cardNumber: 1,
        carNumber: 69,
        date: '2025-04-26',
        logo: 'logo.png',
        sponsorLogo: 'sponsor.png',
        isPublic: false,
        userId,
        panels: [],
      };

      mockCardTemplatesRepository.findOne.mockResolvedValue(existingTemplate);

      await expect(
        service.update(templateId, updateTemplateDto, wrongUserId),
      ).rejects.toThrow(ForbiddenException);
      expect(mockCardTemplatesRepository.findOne).toHaveBeenCalledWith({
        where: { id: templateId },
      });
      expect(mockCardTemplatesRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a card template', async () => {
      const templateId = '1';
      const userId = '1';
      const existingTemplate = {
        id: templateId,
        name: 'Template to delete',
        isPublic: true,
        userId,
      };

      mockCardTemplatesRepository.findOne.mockResolvedValue(existingTemplate);
      mockCardTemplatesRepository.remove.mockResolvedValue(existingTemplate);

      await service.remove(templateId, userId);

      expect(mockCardTemplatesRepository.findOne).toHaveBeenCalledWith({
        where: { id: templateId },
      });
      expect(mockCardTemplatesRepository.remove).toHaveBeenCalledWith(
        existingTemplate,
      );
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '999';
      const userId = '1';

      mockCardTemplatesRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(templateId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockCardTemplatesRepository.findOne).toHaveBeenCalledWith({
        where: { id: templateId },
      });
      expect(mockCardTemplatesRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const templateId = '1';
      const userId = '1';
      const wrongUserId = '2';
      const existingTemplate = {
        id: templateId,
        name: 'Template to delete',
        isPublic: true,
        userId,
      };

      mockCardTemplatesRepository.findOne.mockResolvedValue(existingTemplate);

      await expect(service.remove(templateId, wrongUserId)).rejects.toThrow(
        ForbiddenException,
      );
      expect(mockCardTemplatesRepository.findOne).toHaveBeenCalledWith({
        where: { id: templateId },
      });
      expect(mockCardTemplatesRepository.remove).not.toHaveBeenCalled();
    });
  });
});
