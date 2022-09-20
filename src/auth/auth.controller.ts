import { PromoteAuthDto } from './dto/promote-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, VerifyEmailToken } from './dto';
import { JwtGuard, RolesGuard } from './guard';
import { Roles } from './decorator';
import { Role } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get('verify/:token')
  verify(@Param() params: VerifyEmailToken) {
    return this.authService.verifyEmail(params.token);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('promote')
  findAll(@Body() promoteAuthDto: PromoteAuthDto) {
    return this.authService.promoteAdmin(promoteAuthDto);
  }
}
