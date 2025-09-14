import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/helpers/db/prisma.service';
import { BcryptService } from 'src/common/helpers/bcrypt/bcrypt.service';
import { CreateProfileDto } from './dto/create-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    private prisma: PrismaService,
    private bcrypt: BcryptService,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const { user, ...profile } = createProfileDto;
    const hashedPassword = await this.bcrypt.hashPassword(user.password);

    const result = await this.prisma.profiles.create({
      data: {
        name: profile.name,
        age: profile.age,
        gender: profile.gender,
        user: {
          create: {
            email: user.email,
            password: hashedPassword,
            username: user.username,
            role: user.role,
          },
        },
      },
    });
    return result;
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  // update(id: number, updateProfileDto: Prisma.ProfilesUpdateInput) {
  //   return `This action updates a #${id} profile`;
  // }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
