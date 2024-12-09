import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { NatsModule } from './transports/nats.module';
import { envs } from './config';
import { IncomesModule } from './incomes/incomes.module';
import { FinancialReportModule } from './financial-report/financial-report.module';
import { TransactionsModule } from './transactions/transaction.module';

@Module({
  imports: [NatsModule, ExpensesModule, IncomesModule, FinancialReportModule, TransactionsModule],
})
export class AppModule {}
console.log(envs);
