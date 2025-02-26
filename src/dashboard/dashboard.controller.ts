import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getGeneralStats() {
    return this.dashboardService.getGeneralStats();
  }

  @Get('children-payments')
  async getChildrenPaymentStatus() {
    return this.dashboardService.getChildrenPaymentStatus();
  }

  @Get('financial-history')
  async getFinancialHistory(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.dashboardService.getFinancialHistory(startDate, endDate);
  }

  @Get('average-tuition')
  async getAverageTuitionFee() {
    return this.dashboardService.getAverageTuitionFee();
  }

  @Get('new-enrollments')
  async getNewEnrollments(@Query('month') month: number, @Query('year') year: number) {
    return this.dashboardService.getNewEnrollments(month, year);
  }
}
