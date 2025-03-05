import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from './child.entity';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private childrenRepository: Repository<Child>,
  ) {}

  async create(createChildDto: Partial<Child>): Promise<Child> {
    const child = this.childrenRepository.create(createChildDto);
    return this.childrenRepository.save(child);
  }

  async findAll(): Promise<Child[]> {
    return this.childrenRepository.find();
  }

  async findOne(id: number): Promise<Child> {
    const child = await this.childrenRepository.findOne({ where: { id } });
    if (!child) {
      throw new NotFoundException(`Criança com ID ${id} não encontrada.`);
    }
    return child;
  }

  async update(id: number, updateChildDto: Partial<Child>): Promise<Child> {
    await this.childrenRepository.update(id, updateChildDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.childrenRepository.delete(id);
  }
}
