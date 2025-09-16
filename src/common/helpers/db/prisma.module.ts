import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/common/helpers/db/prisma.service';
import { BcryptModule } from '../bcrypt/bcrypt.module';

@Global()
@Module({
  imports: [BcryptModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
