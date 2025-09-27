import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  HttpCode,
  Patch,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ZodValidationPipe } from 'src/common/pipes/schema.validation.pipes';
import {
  type CreateProfileDto,
  createProfileSchema,
} from './dto/create-profile.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/metadatas/public.metadata';
import {
  updateProfileSchema,
  type UpdateProfileDto,
} from './dto/update-profile.dto';

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

  @Roles(['USER', 'ADMIN'])
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateProfileSchema))
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    const result = this.profilesService.update(+id, updateProfileDto);
    return result;
  }

  @Roles(['USER', 'ADMIN'])
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.profilesService.remove(+id);
    return {
      message: `Username ${result[2].username} succesfully deleted`,
    };
  }
}
