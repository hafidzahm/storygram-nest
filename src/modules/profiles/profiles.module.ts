import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { PrismaModule } from 'src/common/helpers/db/prisma.module';
import { BcryptModule } from 'src/common/helpers/bcrypt/bcrypt.module';

@Module({
  imports: [PrismaModule, BcryptModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
