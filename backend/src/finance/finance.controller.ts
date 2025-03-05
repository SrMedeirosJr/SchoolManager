import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { Finance } from './finance.entity';
import { CreateFinanceDto } from './dto/create-finance.dto'; // ✅ Importamos o DTO corretamente

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  create(@Body() createFinanceDto: CreateFinanceDto): Promise<Finance> {
    return this.financeService.create(createFinanceDto);
  }

  @Get()
  findAll(): Promise<Finance[]> {
    return this.financeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Finance> {
    return this.financeService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateFinanceDto: Partial<Finance>): Promise<Finance> {
    return this.financeService.update(id, updateFinanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.financeService.remove(id);
  }
}
