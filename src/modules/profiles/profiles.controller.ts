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
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
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
      status: Object.prototype.hasOwnProperty.call(
        result[0],
        'count',
      ) as boolean,
      message: `Username ${result[1].username} succesfully deleted`,
    };
  }
}
