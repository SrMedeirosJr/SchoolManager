import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'turminha_chave',
  entities: [User], // Adicione mais entidades aqui conforme necessário
  migrations: ['src/migrations/*.ts'], // Caminho das migrations
  synchronize: false, // Usaremos migrations
  logging: true,
});
