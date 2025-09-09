import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/helpers/db/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: Prisma.UsersCreateInput) {
    return await this.prisma.users.create({
      data: createUserDto,
    });
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
