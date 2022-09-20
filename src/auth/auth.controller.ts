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
import {
  LoginAuthDto,
  PromoteAuthDto,
  RegisterAuthDto,
  VerifyEmailToken,
} from './dto';
import { JwtGuard, RolesGuard } from './guard';
import { Roles } from './decorator';
import { Role } from 'src/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createAuthDto: RegisterAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Get('verify/:token')
  verifyEmail(@Param() params: VerifyEmailToken) {
    return this.authService.verifyEmail(params.token);
  }

  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(JwtGuard, RolesGuard)
  @Patch('promote')
  promoteToAdmin(@Body() promoteAuthDto: PromoteAuthDto) {
    return this.authService.promoteAdmin(promoteAuthDto);
  }
}
