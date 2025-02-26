import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // Pode ser 'user' ou 'admin'
  role: 'user' | 'admin';
}
