import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guards';

@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: { user: any }): Promise<any> {
    return await req.user;
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
