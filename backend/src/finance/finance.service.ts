import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finance } from './finance.entity';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { Child } from '../children/child.entity';
import { Employee } from '../employees/employees.entity';
import { Category } from '../category/category.entity'; // Importando Category

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Finance)
    private financeRepository: Repository<Finance>,

    @InjectRepository(Child)
    private childRepository: Repository<Child>,

    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>, 
  ) {}

  async create(createFinanceDto: CreateFinanceDto, userId: number): Promise<Finance> {
    const { childId, employeeId, category: categoryId, ...financeData } = createFinanceDto;
    
    // Converter categoryId para número
    const categoryIdNumber = parseInt(categoryId as unknown as string, 10);

    const category = await this.categoryRepository.findOne({ where: { id: categoryIdNumber } });
    if (!category) {
      throw new NotFoundException(`Categoria com ID ${categoryIdNumber} não encontrada.`);
    }

    const finance = this.financeRepository.create({
      ...financeData,
      category, 
      createdBy: userId, 
    });

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
      relations: ['child', 'employee', 'category'], 
    });

    return finances.map(finance => ({
      id: finance.id,
      date: finance.date,
      description: finance.description,
      category: finance.category ? finance.category.name : null, 
      amount: finance.amount,
      paymentMethod: finance.paymentMethod,
      type: finance.type,
      createdBy: finance.createdBy, 
      updatedBy: finance.updatedBy,
      deletedBy: finance.deletedBy,
      childId: finance.child ? finance.child.id : null,
      childName: finance.child ? finance.child.fullName : null,
      employeeId: finance.employee ? finance.employee.id : null,
      employeeName: finance.employee ? finance.employee.fullName : null,
    }));
  }

  async findOne(id: number): Promise<Finance> {
    const finance = await this.financeRepository.findOne({ 
      where: { id },
      relations: ['category'], // Incluímos a categoria ao buscar um único item
    });

    if (!finance) {
      throw new NotFoundException(`Transação com ID ${id} não encontrada.`);
    }
    return finance;
  }

  async update(id: number, updateFinanceDto: Partial<Finance>, userId: number): Promise<Finance> {
    const { category: categoryId, ...financeData } = updateFinanceDto;

    let category: Category | undefined = undefined;
    if (categoryId) {
        const categoryIdNumber = parseInt(categoryId as unknown as string, 10);
        category = await this.categoryRepository.findOne({ where: { id: categoryIdNumber } }) || undefined;
    }

    await this.financeRepository.update(id, {
        ...financeData,
        category, 
        updatedBy: userId, 
    });

    return this.findOne(id);
}


  async remove(id: number, userId: number): Promise<void> {
    const finance = await this.findOne(id);
    finance.deletedBy = userId;
    await this.financeRepository.save(finance);
    await this.financeRepository.remove(finance);
  }
}
