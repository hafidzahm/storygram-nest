import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient, Role } from '@prisma/client';
import { BcryptService } from '../bcrypt/bcrypt.service';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    config: ConfigService,
    private bcrypt: BcryptService,
  ) {
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
    // Delete in correct order to respect foreign key constraints
    // Child tables first, then parent tables
    await this.postTags.deleteMany(); // Junction table first
    await this.posts.deleteMany(); // Posts reference Profiles
    await this.tags.deleteMany(); // Delete tags after posts and postTags
    await this.profiles.deleteMany(); // Profiles reference Users
    await this.users.deleteMany(); // Users can be deleted last
  }

  async userTesting() {
    const userData = [
      {
        email: 'percobaan@gmail.com',
        password: await this.bcrypt.hashPassword('12345'),
        role: Role.ADMIN,
        username: 'admin',
      },
      {
        email: 'user@gmail.com',
        password: await this.bcrypt.hashPassword('123456'),
        role: Role.USER,
        username: 'user1',
      },
      {
        email: 'percobaan2@gmail.com', // Changed to avoid duplicate email
        password: await this.bcrypt.hashPassword('1234567'),
        role: Role.USER,
        username: 'percobaan',
      },
    ];

    // First, create users
    const createdUsers: Array<Awaited<ReturnType<typeof this.users.create>>> =
      [];
    for (const user of userData) {
      const createdUser = await this.users.create({
        data: user,
      });
      createdUsers.push(createdUser);
    }

    // Then create profiles with UserId references
    const profileData = [
      {
        name: 'admin',
        age: 23,
        gender: 'MALE',
        UserId: createdUsers[0].id,
      },
      {
        name: 'user1',
        age: 23,
        gender: 'MALE',
        UserId: createdUsers[1].id,
      },
      {
        name: 'percobaan',
        age: 23,
        gender: 'MALE',
        UserId: createdUsers[2].id,
      },
    ];

    return await this.profiles.createMany({
      data: profileData,
    });
  }

  async cleanDbAndCreateProfileTesting() {
    Logger.debug(process.env.NODE_ENV, 'env');
    if (
      process.env.NODE_ENV === 'PRODUCTION' ||
      process.env.NODE_ENV === 'development'
    )
      return;

    await this.cleanDatabase();
    await this.userTesting();
  }
}
