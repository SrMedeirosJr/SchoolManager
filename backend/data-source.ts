import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Child } from './src/children/child.entity';
import { Employee } from './src/employees/employees.entity';
import { Finance } from './src/finance/finance.entity';
import { Category } from './src/category/category.entity';
import * as dotenv from 'dotenv';

// Carrega as variáveis de ambiente
dotenv.config();

// Configuração correta para o TypeORM
const databaseConfig: any = process.env.DATABASE_URL
  ? {
      type: 'mysql' as const, // Garante que o TypeORM entenda que é MySQL
      url: process.env.DATABASE_URL, // Usa a variável DATABASE_URL
      entities: [User, Child, Employee, Finance, Category],
      migrations: ['src/migrations/*.ts'],
      synchronize: false,
      logging: true,
    }
  : {
      type: 'mysql' as const, // Garante o tipo correto
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'turminha_chave',
      entities: [User, Child, Employee, Finance, Category],
      migrations: ['src/migrations/*.ts'],
      synchronize: false,
      logging: true,
    };

export const AppDataSource = new DataSource(databaseConfig);
