import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { NatsModule } from './transports/nats.module';
import { envs } from './config';
import { IncomesModule } from './incomes/incomes.module';
import { FinancialReportModule } from './financial-report/financial-report.module';

@Module({
  imports: [ExpensesModule, NatsModule, IncomesModule, FinancialReportModule],
})
export class AppModule {}
console.log(envs);
