import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employees.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: Partial<Employee>, userId: number): Promise<Employee> {
    const employee = this.employeesRepository.create({
      ...createEmployeeDto,
      createdBy: userId, // Rastreia quem criou
    });
    return this.employeesRepository.save(employee);
  }

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Funcionário com ID ${id} não encontrado.`);
    }
    return employee;
  }

  async update(id: number, updateEmployeeDto: Partial<Employee>, userId: number): Promise<Employee> {
    await this.employeesRepository.update(id, {
      ...updateEmployeeDto,
      updatedBy: userId, // Rastreia quem atualizou
    });
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const employee = await this.findOne(id);
    employee.deletedBy = userId; // Rastreia quem deletou
    await this.employeesRepository.save(employee); // Salva a alteração antes de remover
    await this.employeesRepository.remove(employee);
  }
}
