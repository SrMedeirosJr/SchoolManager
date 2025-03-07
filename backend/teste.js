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

  async getChildrenPaymentStatus(month: number) {
    const year = new Date().getFullYear();
    const startDate = new Date(year, month - 1, 1, 0, 0, 0);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    console.log(`📅 Buscando pagamentos entre ${startDate.toISOString()} e ${endDate.toISOString()}`);

    const result = await this.financeRepository
        .createQueryBuilder("finance")
        .innerJoinAndSelect("finance.child", "child")
        .where("finance.type = :type", { type: "Faturamento" })
        .andWhere("finance.date BETWEEN :startDate AND :endDate", { startDate, endDate })
        .select([
            "child.id AS id",
            "child.fullName AS fullName",
            "child.dueDate AS dueDate",
            "finance.date AS date",
            "finance.amount AS amount",
        ])
        .orderBy("child.dueDate", "ASC")
        .getRawMany();

    return result.map(child => ({
        id: child.id,
        fullName: child.fullName,
        dueDate: child.dueDate,
        date: child.date ? new Date(child.date).toISOString().split("T")[0] : "", // Formatar a data
        amount: child.amount ? parseFloat(child.amount).toFixed(2) : "", // Garantir que amount seja formatado corretamente
        Status: "Pago" // Como estamos filtrando apenas os pagos, sempre retornará "Pago"
    }));
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
