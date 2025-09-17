import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  HttpCode,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ZodValidationPipe } from 'src/common/pipes/schema.validation.pipes';
import {
  type CreateProfileDto,
  createProfileSchema,
} from './dto/create-profile.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/metadatas/public.metadata';

@Controller('/api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}
  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(createProfileSchema))
  async create(@Body() createProfileDto: CreateProfileDto) {
    return {
      message: 'Profile successfully created',
      profile: await this.profilesService.create(createProfileDto),
    };
  }

  @Roles(['USER', 'ADMIN'])
  @Get()
  async findAll() {
    return { profiles: await this.profilesService.findAll() };
  }

  @Roles(['USER', 'ADMIN'])
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const profile = await this.profilesService.findOne(+id);
    return { profile };
  }

  // @Patch(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() updateProfileDto: Prisma.ProfilesUpdateInput,
  //   ) {
  //     return this.profilesService.update(+id, updateProfileDto);
  //   }  @P

  @Roles(['USER', 'ADMIN'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.profilesService.remove(+id);
    return {
      message: `Username ${result[2].username} succesfully deleted`,
    };
  }
}
