import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/common/helpers/db/prisma.module';
import { BcryptModule } from 'src/common/helpers/bcrypt/bcrypt.module';

@Module({
  imports: [PrismaModule, BcryptModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
