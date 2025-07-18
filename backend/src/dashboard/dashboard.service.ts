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

    // 🔹 Obtendo valores brutos
    const [totalChildren, totalRevenue, totalExpenses] = await Promise.all([
        this.childRepository.count(),
        this.getSumByType('Faturamento', startDate, endDate),
        this.getSumByType('Despesa', startDate, endDate),
    ]);
    const financialBalance = totalRevenue - totalExpenses;


  // 🔹 Obtendo valores do mês anterior
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevStartDate = this.setStartOfMonth(prevYear, prevMonth);
    const prevEndDate = this.setEndOfMonth(prevYear, prevMonth);

  const prevTotalRevenue = await this.getSumByType('Faturamento', prevStartDate, prevEndDate);
  const prevTotalExpenses = await this.getSumByType('Despesa', prevStartDate, prevEndDate);
  const prevFinancialBalance = prevTotalRevenue - prevTotalExpenses;

  // 🔹 Evitar divisão por zero e calcular a porcentagem de variação do saldo
  let balancePercentageChange = 0;
  if (prevFinancialBalance !== 0) {
      balancePercentageChange = ((financialBalance - prevFinancialBalance) / Math.abs(prevFinancialBalance)) * 100;
  } else if (financialBalance > 0) {
      balancePercentageChange = 100; // Se no mês anterior era zero, consideramos um crescimento de 100%
  }

    // 🔹 Pegando valores esperados (teto) para calcular a % corretamente
    const totalExpectedResult = await this.childRepository
        .createQueryBuilder("child")
        .select("SUM(child.feeAmount)", "total")
        .getRawOne();
    
    const totalExpected = totalExpectedResult.total ? parseFloat(totalExpectedResult.total) : 0;

    // 🔹 Receita extra (finance sem childId)
    const unassignedRevenueResult = await this.financeRepository
        .createQueryBuilder("finance")
        .select("SUM(finance.amount)", "total")
        .where("finance.childId IS NULL")
        .andWhere("finance.type = 'Faturamento'")
        .andWhere("finance.date BETWEEN :startDate AND :endDate", { startDate, endDate })
        .getRawOne();
    
    const unassignedRevenue = unassignedRevenueResult.total ? parseFloat(unassignedRevenueResult.total) : 0;

    // 🔹 Definindo teto final
    const totalExpectedFinal = totalExpected + unassignedRevenue;
  

    // 🔹 Teto de despesas fixas (Despesas esperadas)
  const totalExpensesFixedQuery = await this.financeRepository
  .createQueryBuilder("finance")
  .select("SUM(finance.amount)", "total")
  .where("finance.type = 'Despesa'")
  .andWhere("finance.categoryId IN (:...categories)", { categories: [1, 3, 7, 8, 9, 12] })
  .andWhere("finance.date BETWEEN :startDate AND :endDate", { startDate, endDate })
  .getRawOne();

const totalExpensesFixed = totalExpensesFixedQuery?.total ? parseFloat(totalExpensesFixedQuery.total) : 0;


    // 🔹 Calculando as porcentagens (evitando divisão por zero)
    const revenuePercentage = totalExpectedFinal ? (totalRevenue / totalExpectedFinal) * 100 : 0;
    const expensesPercentage = totalExpensesFixed ? (totalExpenses / totalExpensesFixed) * 100 : 0;
    const balancePercentage = totalRevenue ? ((totalRevenue - totalExpenses) / totalRevenue) * 100 : 0;

    return {
        totalChildren,
        totalRevenue: totalRevenue.toFixed(2),
        totalRevenuePercentage: Math.round(revenuePercentage),
        totalExpenses: totalExpenses.toFixed(2),
        totalExpensesPercentage: Math.round(expensesPercentage),
        financialBalance: financialBalance.toFixed(2),
        financialBalancePercentage: Math.round(balancePercentageChange)
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

  async getChildrenStatus(month: number, year: number): Promise<any[]> {
    const inicio = new Date(year, month - 1, 1);
    const fim = new Date(year, month, 0, 23, 59, 59); // último dia do mês
  
    const children = await this.childRepository.find();
    const finances = await this.financeRepository.find({
      relations: ['child', 'category'],
      where: {
        date: Between(inicio, fim),
        type: 'Faturamento'
      },
    });
  
    return children
    .map((child) => {
    const pagamento = finances.find(f => f.child?.id === child.id);

    return {
      fullName: child.fullName,
      dueDate: child.dueDate ? Number(child.dueDate) : null,
      paymentDate: pagamento?.date || null,
      amountPaid: pagamento?.amount || 0,
      status: pagamento ? "Pago" : "Pendente"
    };
  })
  .sort((a, b) => Number(a.dueDate ?? 0) - Number(b.dueDate ?? 0));
  }


async getChildStats(childId: number) {
  const child = await this.childRepository.findOne({ where: { id: childId } });
  if (!child) {
    throw new Error("Criança não encontrada");
  }

  const today = new Date();
  const enrollmentDate = new Date(child.enrollmentDate);
  const diffYears = today.getFullYear() - enrollmentDate.getFullYear();
  const diffMonths = today.getMonth() - enrollmentDate.getMonth() + diffYears * 12;
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;

  const tempoMatriculado = `${years > 0 ? `${years} ano${years > 1 ? 's' : ''}` : ''}${
    years > 0 && months > 0 ? ' e ' : ''
  }${months > 0 ? `${months} mês${months > 1 ? 'es' : ''}` : ''}` || 'Menos de 1 mês';

  const arrecadacao = await this.financeRepository
    .createQueryBuilder("finance")
    .select("SUM(finance.amount)", "total")
    .where("finance.childId = :childId", { childId })
    .andWhere("finance.type = 'Faturamento'")
    .getRawOne();

  const valorArrecadado = arrecadacao?.total ? parseFloat(arrecadacao.total).toFixed(2) : "0.00";

  return {
    tempoMatriculado,
    valorArrecadado,
  };
}


  
  
  
}
