import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { GetByDateRangeDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';

@Controller('financial-report')
export class FinancialReportController {
  constructor( 
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('data')
  getByDateRange(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_resumen', {...dateRange});
  }

  @Post('incomes-date')
  getIncomesByDate(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_incomes_by_date', {...dateRange});
  }

  @Post('expenses-date')
  getExpensesByDate(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_expenses_by_date', {...dateRange});
  }

  @Post('incomes-categories')
  getIncomesByCategory(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_incomes_by_categories', {...dateRange});
  }

  @Post('expenses-categories')
  getExpensesByCategory(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_expenses_by_categories', {...dateRange});
  }

  @Post('total-incomes')
  getTotalIncomesByRange(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_total_incomes_by_range', {...dateRange});
  }

  @Post('total-expenses')
  getTotalExpensesByRange(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_total_expenses_by_range', {...dateRange});
  }

  @Post('balance')
  getBalanceByRange(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_balance_by_range', {...dateRange});
  }
}
