import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { Profile } from '@prisma/client';
import { ProfileDto } from 'src/dto/ProfileDto';
import { UserService } from './user.service';

@ApiBearerAuth('JWT-auth')
@Controller('api/profile')
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  //Profile
  @Get()
  async listAllProfile(): Promise<Profile[]> {
    return this.userService.getAllProfile();
  }

  @Get(':id')
  async listProfile(@Param('id', ParseIntPipe) id: number): Promise<Profile> {
    return this.userService.getIndexProfile(id);
  }

  @ApiBody({ type: ProfileDto })
  @Post(':id')
  async createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profileData: ProfileDto,
  ): Promise<object> {
    return this.userService.createProfile(id, profileData);
  }

  @ApiBody({
    type: ProfileDto,
  })
  @Put(':id')
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() profileData: ProfileDto,
  ): Promise<object> {
    return this.userService.updateProfile(id, profileData);
  }

  @Delete(':id')
  async deleteProfile(@Param('id', ParseIntPipe) id: number): Promise<object> {
    return this.userService.deleteProfile(id);
  }
}
