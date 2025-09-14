import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ZodValidationPipe } from 'src/common/pipes/schema.validation.pipes';
import {
  type CreateProfileDto,
  createProfileSchema,
} from './dto/create-profile.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createProfileSchema))
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  // @Patch(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() updateProfileDto: Prisma.ProfilesUpdateInput,
  //   ) {
  //     return this.profilesService.update(+id, updateProfileDto);
  //   }  @P

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
