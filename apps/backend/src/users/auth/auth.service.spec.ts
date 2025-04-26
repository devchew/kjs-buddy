import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users.service';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user without password if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { 
        id: '1', 
        email, 
        username: 'testuser',
        password: 'hashedPassword',
        role: 'user'
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(email, password);
      
      expect(result).toEqual({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      });
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });

    it('should return null if user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);
      
      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return null if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const user = { 
        id: '1', 
        email, 
        username: 'testuser',
        password: 'hashedPassword',
        role: 'user'
      };

      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser(email, password);
      
      expect(result).toBeNull();
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    });
  });

  describe('login', () => {
    it('should return token and user data for valid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      const user = {
        id: '1',
        email: loginDto.email,
        role: 'user'
      };
      
      const token = 'generated_token';
      const expectedResponse = {
        access_token: token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      };

      // Mock validateUser to return a user without password
      jest.spyOn(service, 'validateUser').mockResolvedValue(user);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(loginDto);
      
      expect(result).toEqual(expectedResponse);
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ 
        email: user.email, 
        sub: user.id,
        role: user.role
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrongPassword'
      };

      // Mock validateUser to return null for invalid credentials
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(service.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create a new user, generate token and return user data', async () => {
      const registerDto = {
        email: 'new@example.com',
        username: 'newuser',
        password: 'password123',
      };
      
      const createdUser = {
        id: '1',
        email: registerDto.email,
        username: registerDto.username,
        password: 'hashedPassword',
        role: 'user'
      };

      const userWithoutPassword = {
        id: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
        role: createdUser.role
      };

      const token = 'generated_token';
      const expectedResponse = {
        access_token: token,
        user: {
          id: userWithoutPassword.id,
          email: userWithoutPassword.email,
          role: userWithoutPassword.role
        }
      };

      mockUsersService.create.mockResolvedValue(createdUser);
      mockJwtService.sign.mockReturnValue(token);

      const result = await service.register(registerDto);
      
      expect(result).toEqual(expectedResponse);
      expect(mockUsersService.create).toHaveBeenCalledWith(registerDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ 
        email: userWithoutPassword.email, 
        sub: userWithoutPassword.id,
        role: userWithoutPassword.role
      });
    });
  });
});