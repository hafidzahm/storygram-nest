import { Controller, Post, UseGuards, Request, Res, Get } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guards';
import { AuthService } from './auth.service';
import { Users } from '@prisma/client';
import type { Response } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import type { RequestUser } from './request-auth.interface';

@Controller()
export class AuthController {
  constructor(private auth: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  login(
    @Request() req: { user: Users },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.login(req.user, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: RequestUser) {
    return req.user;
  }
  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(
    @Request() req: { logout: () => Promise<void> },
  ): Promise<{ message: string }> {
    await req.logout();
    return { message: 'Logged out successfully' };
  }
}
