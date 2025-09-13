import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    Logger.log('Prisma connected', 'PrismaService');
    await this.$connect();
  }

  async onModuleDestroy() {
    Logger.log('Prisma disconnected', 'PrismaService');
    await this.$disconnect();
  }
}
