import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateExpenseDto } from 'src/common/dto/finance/create-expense.dto';
import { GetByDateRangeDto } from 'src/common/dto/finance/get-by-range.dto';
import { UpdateExpenseDto } from 'src/common/dto/finance/update-expense.dto';
import { NATS_SERVICE } from 'src/config/services';

@Controller('expenses')
export class ExpensesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  createExpense(@Body() createExpenseDto: CreateExpenseDto) {   
    return this.client.send('create_expense', {...createExpenseDto});
  }

  @Get()
  findAllExpenses() {
    return this.client.send('find_all_expenses', {});
  }
  
  @Patch(':id')
  updateExpense(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateExpenseDto: UpdateExpenseDto
  ) {
    return this.client.send('update_expense', {id, ...updateExpenseDto});
  }

  @Delete(':id')
  deleteExpense(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('delete_expense', {id});
  }

  @Post('range')
  findExpensesByDateRange(@Body() dateRange: GetByDateRangeDto) {
    return this.client.send('get_expenses_by_date_range', {...dateRange});
  }  
}
