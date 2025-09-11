import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plainPassword, saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  }
}
