import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UsersService } from '../users.service';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
    role: string;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Get user profile information' })
  @ApiResponse({ status: 200, description: 'Returns user profile data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: RequestWithUser) {
    // Get the complete user data from the database
    const user = await this.usersService.findById(req.user.userId);

    if (!user) {
      return { error: 'User not found' };
    }

    // Remove sensitive information before sending the response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userProfile } = user;

    return userProfile;
  }
}
