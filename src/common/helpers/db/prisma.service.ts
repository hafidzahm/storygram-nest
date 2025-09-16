import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }
  async onModuleInit() {
    Logger.log('Prisma connected', 'PrismaService');
    await this.$connect();
  }

  async onModuleDestroy() {
    Logger.log('Prisma disconnected', 'PrismaService');
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'PRODUCTION') return;

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
