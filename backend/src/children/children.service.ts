import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from './child.entity';

@Injectable()
export class ChildrenService {
  constructor(
    @InjectRepository(Child)
    private childrenRepository: Repository<Child>,
  ) {}

  async create(createChildDto: Partial<Child>, userId: number): Promise<Child> {
    const child = this.childrenRepository.create({
      ...createChildDto,
      createdBy: userId, // Rastreia quem criou
    });
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

  async update(id: number, updateChildDto: Partial<Child>, userId: number): Promise<Child> {
    await this.childrenRepository.update(id, {
      ...updateChildDto,
      updatedBy: userId, // Rastreia quem atualizou
    });
    return this.findOne(id);
  }

  async remove(id: number, userId: number): Promise<void> {
    const child = await this.findOne(id);
    child.deletedBy = userId; // Rastreia quem deletou
    await this.childrenRepository.save(child); // Salva a alteração antes de remover
    await this.childrenRepository.remove(child);
  }
}
