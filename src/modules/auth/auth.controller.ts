import { Controller, Post, UseGuards, Request, Res, Get } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guards';
import { AuthService } from './auth.service';
import { Users } from '@prisma/client';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import type { RequestUser } from './request-auth.interface';
import { Public } from 'src/common/metadatas/public.metadata';
import { User } from 'src/common/decorators/user.decorator';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(
    @Request() req: { user: Users },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.login(req.user, res);
  }

  @Public()
  @Get('profile/without')
  logout() {
    return {
      message: 'Hello',
    };
  }

  @Get('profile')
  getProfile(@User() user: RequestUser) {
    return { loginUser: user };
  }
}
