import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtFromRequestFunction } from 'passport-jwt';
import { TokenPayload } from './payload.interface';
import { RequestCookieAuth } from './request-cookies.type';

const cookieExtractor: JwtFromRequestFunction = (req: RequestCookieAuth) => {
  if (req && req.cookies && typeof req.cookies['Authentication'] === 'string') {
    return req.cookies['Authentication'];
  }
  return null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  validate(payload: TokenPayload) {
    return {
      userId: payload.userId,
      username: payload.username,
      email: payload.email,
      role: payload.role,
    };
  }
}
