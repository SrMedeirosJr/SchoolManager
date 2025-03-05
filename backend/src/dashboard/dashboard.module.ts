import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Child } from '../children/child.entity';
import { Finance } from '../finance/finance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Child, Finance])], 
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
