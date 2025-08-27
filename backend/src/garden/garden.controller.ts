import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/roles.decorator';
import { GardenDto } from 'src/dto/garden.dto';
import { GardenService } from './garden.service';

@ApiTags('Gardens')
@ApiBearerAuth('JWT-auth')
@Controller('gardens')
export class GardenController {
  constructor(private readonly gardenService: GardenService) {}

  @Roles(Role.ADMIN)
  @ApiBody({ type: GardenDto })
  @Post()
  async create(@Body() dto: GardenDto) {
    return this.gardenService.create(dto);
  }

  @Roles(Role.ADMIN)
  @Get()
  async findAll() {
    return this.gardenService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gardenService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: GardenDto,
    @Request() req,
  ) {
    return this.gardenService.update(id, dto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.gardenService.remove(id);
  }
}
