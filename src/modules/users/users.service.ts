import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { BcryptService } from 'src/common/helpers/bcrypt/bcrypt.service';
import { PrismaService } from 'src/common/helpers/db/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private bcrypt: BcryptService,
  ) {}

  async create(createUserDto: Prisma.UsersCreateInput) {
    const hashedPassword = await this.bcrypt.hashPassword(
      createUserDto.password,
    );
    const { username, email, role } = await this.prisma.users.create({
      data: { ...createUserDto, password: hashedPassword },
    });
    return { username, email, role };
  }

  async findAll() {
    return await this.prisma.users.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.users.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateUserDto: Prisma.UsersUpdateInput) {
    return await this.prisma.users.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.users.delete({
      where: {
        id,
      },
    });
  }
}
