import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between  } from 'typeorm';
import { Child } from '../children/child.entity';
import { Finance } from '../finance/finance.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Child)
    private readonly childRepository: Repository<Child>,
    @InjectRepository(Finance)
    private readonly financeRepository: Repository<Finance>,
  ) {}

  async getGeneralStats() {
    const totalChildren = await this.childRepository.count();

    const totalRevenue = await this.financeRepository
      .createQueryBuilder('finance')
      .where('finance.type = :type', { type: 'Faturamento' })
      .select('SUM(finance.amount)', 'total')
      .getRawOne();

    const totalExpenses = await this.financeRepository
      .createQueryBuilder('finance')
      .where('finance.type = :type', { type: 'Despesa' })
      .select('SUM(finance.amount)', 'total')
      .getRawOne();

    return {
      totalChildren,
      totalRevenue: totalRevenue.total || 0,
      totalExpenses: totalExpenses.total || 0,
      financialBalance: (totalRevenue.total || 0) - (totalExpenses.total || 0),
    };
  }
  async getChildrenPaymentStatus() {
    return this.childRepository.find({
      select: ['id', 'fullName', 'dueDate'],
    });
  }
  
  async getFinancialHistory(startDate: string, endDate: string) {
    return this.financeRepository.find({
      where: { date: Between(new Date(startDate), new Date(endDate)) }, 
      order: { date: 'DESC' },
    });
  }
  
  
  async getAverageTuitionFee() {
    const result = await this.childRepository
      .createQueryBuilder('child')
      .select('AVG(child.feeAmount)', 'average')
      .getRawOne();
  
    return { averageTuitionFee: result.average || 0 };
  }
  
  async getNewEnrollments(month: number, year: number) {
    const startDate = new Date(year, month - 1, 1); 
    const endDate = new Date(year, month, 0); 
  
    return this.childRepository.count({
      where: {
        enrollmentDate: Between(startDate, endDate), 
      },
    });
  }
  
}
