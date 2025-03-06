import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Child } from '../children/child.entity';
import { Employee } from '../employees/employees.entity';
import { Category } from '../category/category.entity';

@Entity()
export class Finance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column()
  description: string;

  @ManyToOne(() => Category, { eager: true }) // Obtém automaticamente a categoria ao buscar uma transação
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Child, (child) => child.id, { nullable: true, onDelete: 'SET NULL' })
  child?: Child | null;

  @ManyToOne(() => Employee, (employee) => employee.id, { nullable: true, onDelete: 'SET NULL' })
  employee?: Employee | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentMethod: string;

  @Column()
  type: string;

  @Column({ default: false })
  deleted: boolean;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ nullable: true })
  updatedBy: number;

  @Column({ nullable: true })
  deletedBy: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
