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
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Sale } from '@prisma/client';
import { SaleDto } from 'src/dto/sale.dto';
import { SaleService } from './sale.service';

@ApiTags('Sale')
@ApiBearerAuth('JWT-auth')
@Controller('sale')
export class SaleController {
  constructor(private readonly saleService: SaleService) {}

  @Get()
  async findAll() {
    return this.saleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Sale | null> {
    return this.saleService.findOne(id);
  }

  @Post()
  @ApiBody({ type: SaleDto })
  async create(@Body() dto: SaleDto) {
    return this.saleService.create(dto);
  }

  @Put(':id')
  @ApiBody({ type: SaleDto })
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: SaleDto) {
    return this.saleService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.saleService.remove(id);
  }
}
