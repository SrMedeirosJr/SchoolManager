import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { Finance } from './finance.entity';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(@Request() req, @Body() createFinanceDto: CreateFinanceDto): Promise<Finance> {
  return this.financeService.create(createFinanceDto, req.user.id);
}

  @UseGuards(AuthGuard)
  @Get()
  findAll(): Promise<Finance[]> {
    return this.financeService.findAll();
  }

  
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Finance> {
    return this.financeService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateFinanceDto: Partial<Finance>, @Request() req): Promise<Finance> {
    return this.financeService.update(id, updateFinanceDto, req.user.id); // Captura o ID do usuário autenticado
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req): Promise<void> {
    return this.financeService.remove(id, req.user.id); // Captura o ID do usuário autenticado
  }
}
