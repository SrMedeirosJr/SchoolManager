import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
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

  private setStartOfMonth(year: number, month: number): Date {
    return new Date(year, month - 1, 1, 0, 0, 0);
  }

  private setEndOfMonth(year: number, month: number): Date {
    return new Date(year, month, 0, 23, 59, 59);
  }

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

  private async getSumByType(type: 'Faturamento' | 'Despesa', startDate: Date, endDate: Date): Promise<number> {
    const result = await this.financeRepository
      .createQueryBuilder('finance')
      .select('SUM(finance.amount)', 'total')
      .where('finance.type = :type', { type })
      .andWhere('finance.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return result.total ? parseFloat(result.total) : 0;
  }

  async getStatsByMonth(month: number) {
    const year = new Date().getFullYear();
    const startDate = this.setStartOfMonth(year, month);
    const endDate = this.setEndOfMonth(year, month);

    const [totalChildren, totalRevenue, totalExpenses] = await Promise.all([
      this.childRepository.count({ where: { enrollmentDate: Between(startDate, endDate) } }),
      this.getSumByType('Faturamento', startDate, endDate),
      this.getSumByType('Despesa', startDate, endDate),
    ]);

    return {
      totalChildren,
      totalRevenue: totalRevenue.toFixed(2),
      totalExpenses: totalExpenses.toFixed(2),
      financialBalance: (totalRevenue - totalExpenses).toFixed(2),
    };
  }

  async getRecordsByMonth(month: number) {
    const year = new Date().getFullYear();
    const startDate = this.setStartOfMonth(year, month);
    const endDate = this.setEndOfMonth(year, month);

    const [children, expenses, revenues] = await Promise.all([
      this.childRepository.find({
        where: { enrollmentDate: Between(startDate, endDate) },
      }),
      this.getTransactionsByType('Despesa', startDate, endDate),
      this.getTransactionsByType('Faturamento', startDate, endDate),
    ]);

    return {
      children,
      finances: {
        expenses,
        revenues,
      },
    };
  }

  private async getTransactionsByType(
    type: 'Faturamento' | 'Despesa',
    startDate: Date,
    endDate: Date,
  ): Promise<Finance[]> {
    return this.financeRepository.find({
      where: { date: Between(startDate, endDate), type },
      relations: ['child', 'employee'],
    });
  }

  async getChildrenPaymentStatus(month?: number) {
    const year = new Date().getFullYear();
    const startDate = this.setStartOfMonth(year, month || new Date().getMonth() + 1);
    const endDate = this.setEndOfMonth(year, month || new Date().getMonth() + 1);

    // 🔹 Buscar crianças cadastradas
    const children = await this.childRepository.find({
      select: ['id', 'fullName', 'dueDate'],
    });

    // 🔹 Buscar pagamentos SOMENTE dentro do mês filtrado
    const financeRecords = await this.financeRepository
      .createQueryBuilder('finance')
      .select(['finance.childId', 'SUM(finance.amount) as totalPaid'])
      .where('finance.type = :type', { type: 'Faturamento' }) 
      .andWhere('finance.date BETWEEN :startDate AND :endDate', { startDate, endDate }) // 🔹 Filtrando pelo mês correto
      .groupBy('finance.childId')
      .getRawMany();

    // 🔹 Mapear pagamentos por childId
    const paymentsMap = new Map<number, { totalPaid: string }>();
    financeRecords.forEach((record) => {
      paymentsMap.set(record.childId, { totalPaid: parseFloat(record.totalPaid).toFixed(2) });
    });

    // 🔹 Organizar crianças por dueDate
    const groupedByDueDate: Record<string, any[]> = {};

    children.forEach((child) => {
      const dueDateKey = `dueDate ${child.dueDate}`;

      if (!groupedByDueDate[dueDateKey]) {
        groupedByDueDate[dueDateKey] = [];
      }

      const payment = paymentsMap.get(child.id);

      groupedByDueDate[dueDateKey].push({
        id: child.id,
        fullName: child.fullName,
        dueDate: child.dueDate,
        amount: payment ? payment.totalPaid : "",
        Status: payment ? "Pago" : "Não Pago",
      });
    });

    return groupedByDueDate;
  }


  async getAverageTuitionFee() {
    const result = await this.childRepository
      .createQueryBuilder('child')
      .select('AVG(child.feeAmount)', 'average')
      .getRawOne();

    return { averageTuitionFee: result.average || 0 };
  }

  async getNewEnrollments(month: number, year: number) {
    const startDate = this.setStartOfMonth(year, month);
    const endDate = this.setEndOfMonth(year, month);

    return this.childRepository.count({
      where: {
        enrollmentDate: Between(startDate, endDate),
      },
    });
  }
}
