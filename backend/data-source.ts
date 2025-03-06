import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { Child } from './src/children/child.entity';
import { Employee } from './src/employees/employees.entity';
import { Finance } from './src/finance/finance.entity';
import { Category } from './src/category/category.entity';


export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'turminha_chave',
  entities: [User, Child, Employee, Finance, Category], 
  migrations: ['src/migrations/*.ts'], 
  synchronize: false,
  logging: true,
});
