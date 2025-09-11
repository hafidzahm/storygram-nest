import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { BcryptService } from 'src/common/helpers/bcrypt/bcrypt.service';

@Injectable()
export class AuthService {
  constructor(
    private user: UsersService,
    private bcrypt: BcryptService,
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
}
