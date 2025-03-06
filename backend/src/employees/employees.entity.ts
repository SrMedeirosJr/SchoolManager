import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column()
  position: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary: number;

  @Column({ type: 'date', nullable: true })
  hiringDate?: Date;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ default: 'ativo' })
  status: string;

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
    
  @Column({ type: "timestamp", nullable: true })
  deletedAt: Date;
}
