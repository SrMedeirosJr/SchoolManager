import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Child } from '../children/child.entity';
import { Employee } from '../employees/employees.entity';

@Entity()
export class Finance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  description: string;

  @Column()
  category: string;

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
}
