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
import { GetUser } from './decorator';
import { CreateAuthDto, VerifyEmailToken } from './dto';
import { JwtGuard } from './guard';

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

  @UseGuards(JwtGuard)
  @Patch('promote')
  findAll(@GetUser('id') id: string, @Body() promoteAuthDto: PromoteAuthDto) {
    return this.authService.promoteAdmin(id, promoteAuthDto);
  }
}
