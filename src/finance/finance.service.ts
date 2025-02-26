import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finance } from './finance.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance)
    private financeRepository: Repository<Finance>,
  ) {}

  async create(createFinanceDto: Partial<Finance>): Promise<Finance> {
    const finance = this.financeRepository.create(createFinanceDto);
    return this.financeRepository.save(finance);
  }

  async findAll(): Promise<any[]> {
    const finances = await this.financeRepository.find({
      relations: ['child', 'employee'],
    });
  
    return finances.map(finance => {
      const formattedFinance: any = {
        id: finance.id,
        date: finance.date,
        description: finance.description,
        category: finance.category,
        amount: finance.amount,
        paymentMethod: finance.paymentMethod,
        type: finance.type,
      };
  
      if (finance.child) {
        formattedFinance.childId = finance.child.id;
      }
  
      if (finance.employee) {
        formattedFinance.employeeId = finance.employee.id;
      }
  
      return formattedFinance;
    });
  }
  
  

  async findOne(id: number): Promise<Finance> {
    const finance = await this.financeRepository.findOne({ where: { id } });
    if (!finance) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada.`);
    }
    return finance;
  }

  async update(id: number, updateFinanceDto: Partial<Finance>): Promise<Finance> {
    await this.financeRepository.update(id, updateFinanceDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const finance = await this.findOne(id);
    await this.financeRepository.remove(finance);
  }
}
