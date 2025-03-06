import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, userId: number): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      name: createUserDto.name,
      password: hashedPassword,
      role: createUserDto.role || 'user',
      createdBy: userId, // Salvando quem criou o usuário
    });

    return this.usersRepository.save(user);
  }

  async findByName(name: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { name } });
    return user ?? undefined; 
  }

  async login(name: string, password: string) {
    const user = await this.findByName(name);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Nome de usuário ou senha inválidos');
    }

    const payload = { id: user.id, name: user.name, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'seu_segredo_super_secreto', {
      expiresIn: '1h',
    });

    return { access_token: token };
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find(); 
  }

  async update(id: number, updateUserDto: CreateUserDto, userId: number): Promise<User | undefined> {
    const hashedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : undefined;

    await this.usersRepository.update(id, {
      ...updateUserDto,
      password: hashedPassword,
      updatedBy: userId, // Salvando quem atualizou o usuário
    });

    const updatedUser = await this.usersRepository.findOne({ where: { id } });
    return updatedUser ?? undefined; 
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.usersRepository.update(id, { deletedBy: userId }); // Salvando quem deletou o usuário
    await this.usersRepository.delete(id);
  }
}
