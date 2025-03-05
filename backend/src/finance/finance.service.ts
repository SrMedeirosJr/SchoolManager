import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finance } from './finance.entity';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { Child } from '../children/child.entity';
import { Employee } from '../employees/employees.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance)
    private financeRepository: Repository<Finance>,

    @InjectRepository(Child)
    private childRepository: Repository<Child>,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async create(createFinanceDto: CreateFinanceDto): Promise<Finance> {
    const { childId, employeeId, ...financeData } = createFinanceDto;

    const finance = this.financeRepository.create(financeData);

    if (childId) {
      const child = await this.childRepository.findOne({ where: { id: childId } });
      if (!child) {
        throw new NotFoundException(`Criança com ID ${childId} não encontrada.`);
      }
      finance.child = child;
    }

    if (employeeId) {
      const employee = await this.employeeRepository.findOne({ where: { id: employeeId } });
      if (!employee) {
        throw new NotFoundException(`Funcionário com ID ${employeeId} não encontrado.`);
      }
      finance.employee = employee;
    }

    return this.financeRepository.save(finance);
  }

  async findAll(): Promise<any[]> {
    const finances = await this.financeRepository.find({
      relations: ['child', 'employee'],
    });

    return finances.map(finance => {
      return {
        id: finance.id,
        date: finance.date,
        description: finance.description,
        category: finance.category,
        amount: finance.amount,
        paymentMethod: finance.paymentMethod,
        type: finance.type,
        childId: finance.child ? finance.child.id : null,
        employeeId: finance.employee ? finance.employee.id : null,
      };
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
