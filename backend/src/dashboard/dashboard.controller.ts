import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getGeneralStats() {
    return this.dashboardService.getGeneralStats();
  }

  @Get('stats-by-month')
  async getStatsByMonth(@Query('month') month: string) {
    const monthNumber = parseInt(month, 10);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      return { error: 'Mês inválido. Use um valor entre 1 e 12.' };
    }
    return this.dashboardService.getStatsByMonth(monthNumber);
  }

  @Get('records-by-month')
  async getRecordsByMonth(@Query('month') month: string) {
  const monthNumber = parseInt(month, 10);
  if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    return { error: 'Mês inválido. Use um valor entre 1 e 12.' };
  }
  return this.dashboardService.getRecordsByMonth(monthNumber);
}

  @Get('average-tuition')
  async getAverageTuitionFee() {
    return this.dashboardService.getAverageTuitionFee();
  }

  @Get('new-enrollments')
  async getNewEnrollments(@Query('month') month: number, @Query('year') year: number) {
    return this.dashboardService.getNewEnrollments(month, year);
  }

  @Get("/children-status")
  async getChildrenStatus(
  @Query("month") month: number,
  @Query("year") year: number
) {
  return this.dashboardService.getChildrenStatus(month, year);
}


}
