import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BcryptService } from 'src/common/helpers/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Users } from '@prisma/client';
import type { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private user: UsersService,
    private bcrypt: BcryptService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async validateUser(email: string, password: string) {
    const findedUser = await this.user.findByEmail(email);
    const comparePassword = await this.bcrypt.comparePassword(
      password,
      findedUser?.password as string,
    );

    if (findedUser && comparePassword) {
      const { password, ...result } = findedUser;
      return result;
    }
    return null;
  }
  login(user: Users, response: Response) {
    const expireAccessToken = new Date();
    expireAccessToken.setTime(
      expireAccessToken.getTime() +
        parseInt(this.config.getOrThrow('JWT_EXPIRES_IN')),
    );
    const payload = {
      username: user.username,
      sub: String(user.id),
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const access_token = this.jwt.sign(payload, {
      secret: this.config.getOrThrow('JWT_SECRET'),
      expiresIn: parseInt(this.config.getOrThrow('JWT_EXPIRES_IN')) / 1000,
    });

    response.cookie('Authentication', access_token, {
      httpOnly: true,
      secure: this.config.getOrThrow('NODE_ENV') === 'production',
      expires: expireAccessToken,
    });
    return { message: 'Login successfully' };
  }
}
