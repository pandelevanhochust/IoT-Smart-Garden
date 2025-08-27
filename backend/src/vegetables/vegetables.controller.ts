import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PriceDto } from 'src/dto/price.dto';
import { VegetableDto } from 'src/dto/vegetable.dto';
import { VegetablesService } from './vegetables.service';

@ApiTags('Vegetables')
@ApiBearerAuth('JWT-auth')
@Controller('vegetables')
export class VegetablesController {
  constructor(private readonly svc: VegetablesService) {}

  @Post('')
  async create(@Body() dto: VegetableDto) {
    return this.svc.create(dto);
  }

  @Get('')
  async findAll() {
    return this.svc.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VegetableDto,
  ) {
    return this.svc.update(id, dto);
  }

  @Put('/:id/qty')
  async updateQty(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VegetableDto,
  ) {
    return this.svc.updateQty(id, dto);
  }

  @Delete('/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }

  // Price
  @Post('/:id/price')
  async setPrice(@Param('id', ParseIntPipe) id: number, @Body() dto: PriceDto) {
    return this.svc.setPrice(id, dto);
  }

  @Put('/:id/price')
  async updatePrice(@Param('id', ParseIntPipe) id: number, @Body() dto: PriceDto) {
    return this.svc.setPrice(id, dto);
  }

  @Delete('/:id/price')
  async clearPrice(@Param('id', ParseIntPipe) id: number) {
    return this.svc.clearPrice(id);
  }

  @Get('/:id/price')
  async getPrice(@Param('id', ParseIntPipe) id: number) {
    return this.svc.getPrice(id);
  }

  // GET /price  
  @Get('price')
  async listCurrentPrices() {
    return this.svc.listCurrentPrices();
  }
}
