import { Global, Module } from '@nestjs/common';
import { PrismaService } from 'src/helpers/db/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
