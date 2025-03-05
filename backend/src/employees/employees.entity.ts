import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
}
