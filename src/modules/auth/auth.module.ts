import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/modules/auth/auth.controller';
import { UsersModule } from '../users/users.module';
import { BcryptModule } from 'src/common/helpers/bcrypt/bcrypt.module';

@Module({
  imports: [UsersModule, PassportModule, BcryptModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
