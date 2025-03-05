import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
