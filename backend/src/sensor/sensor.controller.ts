import { Role } from '.prisma/client/default';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LedControlDto } from 'src/dto/led-control.dto';
import { SensorDataDto } from 'src/dto/sensor.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { SensorService } from './sensor.service';

@ApiBearerAuth('JWT-auth')
@Controller('sensor')
@Roles(Role.ADMIN)
export class SensorController {
  constructor(private readonly sensorService: SensorService) {}

  @Get()
  async findAll() {
    return this.sensorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sensorService.findOne(id);
  }

  @Post()
  async create(@Body() dto: SensorDataDto) {
    return this.sensorService.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SensorDataDto,
  ) {
    return this.sensorService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.sensorService.remove(id);
  }

  @Get(':gardenId')
  @Roles('ADMIN')
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  async getHistory(
    @Param('gardenId', ParseIntPipe) gid: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.sensorService.history(
      gid,
      from ? new Date(from) : undefined,
      to ? new Date(to) : undefined,
    );
  }

  @Post(':gardenId/led')
  @Roles('ADMIN')
  async controlLed(
    @Param('gardenId', ParseIntPipe) gardenId: number,
    @Body() dto: LedControlDto,
    @Request() req: any,
  ) {
    return this.sensorService.controlLed(
      {
        gardenId,
        led1State: dto.led1State,
        led2State: dto.led2State,
        led3State: dto.led3State,
        recordedAt: dto.recordedAt,
      }
    );
  }
}
