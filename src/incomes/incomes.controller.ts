import { Body, Controller, Get, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateIncomeDto, GetByDateRangeDto } from 'src/common';
import { NATS_SERVICE } from 'src/config/services';

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
  findAllSales() {
    return this.client.send('find_all_sales', {});
  }

  @Post('sales-date-range')
  findSalesByDateRange(@Body() getSalesByDateRangeDto: GetByDateRangeDto) {
    return this.client.send('find_sales_by_date_range', {...getSalesByDateRangeDto});
  }

  @Post('date-range')
  findByDateRange(@Body() getIncomeByDateRangeDto: GetByDateRangeDto) {
    return this.client.send('find_income_by_date_range', {...getIncomeByDateRangeDto});
  }

  @Get(':id')
  findOne(@Body() id: string) {
    return this.client.send('find_income_by_id', {id});
  }

  @Get('weekly-sales/:id')
  getWeeklySales(@Param('id', ParseUUIDPipe) entrepreneurId: string) {
    return this.client.send('get_weekly_sales', entrepreneurId );
  }
}
