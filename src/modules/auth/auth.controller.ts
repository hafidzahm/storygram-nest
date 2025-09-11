import { Controller, Post, UseGuards, Request, Res } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guards';
import { AuthService } from './auth.service';
import { Users } from '@prisma/client';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Request() req: { user: Users },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.login(req.user, res);
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
