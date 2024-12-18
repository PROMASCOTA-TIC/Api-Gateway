import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateIncomeDto, GetByDateRangeDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';

@Controller('incomes')
export class IncomesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  create(@Body() createIncomeDto: CreateIncomeDto) {
    return this.client.send('create_income', {...createIncomeDto});
  }

  @Get()
  finAllIncomes() {
    return this.client.send('find_all_incomes', {});
  }

  @Post('range')
  findByDateRange(@Body() getIncomeByDateRangeDto: GetByDateRangeDto) {
    return this.client.send('find_income_by_date_range', {...getIncomeByDateRangeDto});
  }
}
