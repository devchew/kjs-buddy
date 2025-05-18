import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUsersRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user by ID', async () => {
      const userId = '1';
      const expectedUser = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
      };

      mockUsersRepository.findOneBy.mockResolvedValue(expectedUser);

      const result = await service.findById(userId);

      expect(result).toEqual(expectedUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id: userId,
      });
    });

    it('should return null if user not found', async () => {
      const userId = '999';

      mockUsersRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findById(userId);

      expect(result).toBeNull();
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        id: userId,
      });
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: '1',
        email,
        username: 'testuser',
      };

      mockUsersRepository.findOneBy.mockResolvedValue(expectedUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(expectedUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ email });
    });

    it('should return null if no user found with email', async () => {
      const email = 'nonexistent@example.com';

      mockUsersRepository.findOneBy.mockResolvedValue(null);

      const result = await service.findByEmail(email);

      expect(result).toBeNull();
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({ email });
    });
  });

  describe('create', () => {
    it('should create and return a new user with hashed password', async () => {
      const registerDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      };

      const hashedPassword = 'hashed_password';
      const newUser = {
        id: '1',
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
      };

      mockUsersRepository.findOneBy.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockUsersRepository.create.mockReturnValue(newUser);
      mockUsersRepository.save.mockResolvedValue(newUser);

      const result = await service.create(registerDto);

      expect(result).toEqual(newUser);
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockUsersRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: hashedPassword,
      });
      expect(mockUsersRepository.save).toHaveBeenCalledWith(newUser);
    });

    it('should throw ConflictException if user with email already exists', async () => {
      const registerDto = {
        email: 'existing@example.com',
        username: 'newuser',
        password: 'password123',
      };

      const existingUser = {
        id: '1',
        email: registerDto.email,
        username: 'existinguser',
      };

      mockUsersRepository.findOneBy.mockResolvedValue(existingUser);

      await expect(service.create(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUsersRepository.findOneBy).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(mockUsersRepository.create).not.toHaveBeenCalled();
    });
  });
});
