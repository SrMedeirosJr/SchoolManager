import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fullName: string;

  @Column()
  birthDate: Date;

  @Column()
  enrollmentDate: Date;

  @Column()
  schedule: string;

  @Column()
  class: string;

  @Column()
  feeAmount: number;

  @Column()
  dueDate: number;

  @Column({ nullable: true })
  fatherName?: string;

  @Column({ nullable: true })
  fatherPhone?: string;

  @Column({ nullable: true })
  motherName?: string;

  @Column({ nullable: true })
  motherPhone?: string;

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
