import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return await this.prisma.profiles.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const profile = await this.prisma.profiles.findUnique({
      where: {
        UserId: id,
      },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });
    if (!profile) {
      throw new NotFoundException('Profile user not found');
    }
    return profile;
  }

  // update(id: number, updateProfileDto: Prisma.ProfilesUpdateInput) {
  //   return `This action updates a #${id} profile`;
  // }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
