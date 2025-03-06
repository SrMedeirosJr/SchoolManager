// Importações principais
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Child } from './children/child.entity';
import { Employee } from './employees/employees.entity';
import { Finance } from './finance/finance.entity';
import { ChildrenModule } from './children/children.module';
import { EmployeesModule } from './employees/employees.module';
import { FinanceModule } from './finance/finance.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CategoryModule } from './category/category.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'turminha_chave',
      entities: [User, Child, Employee, Finance],
      autoLoadEntities: true,
      synchronize: false, // 
    }),
    UsersModule,
    ChildrenModule,
    EmployeesModule,
    FinanceModule,
    DashboardModule,
    CategoryModule,

  ],
})
export class AppModule {}
