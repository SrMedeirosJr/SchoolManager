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
import { Category } from './category/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), 

    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST || 'localhost',
      port: process.env.DATABASE_URL ? undefined : parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DATABASE_URL ? undefined : process.env.DB_USER || 'root',
      password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD || 'root',
      database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME || 'turminha_chave',
      entities: [User, Child, Employee, Finance, Category],
      autoLoadEntities: true,
      synchronize: false, 
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
