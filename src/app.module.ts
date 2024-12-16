import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { NatsModule } from './transports/nats.module';
import { envs } from './config';
import { IncomesModule } from './incomes/incomes.module';
import { FinancialReportModule } from './financial-report/financial-report.module';
import { TransactionsModule } from './transactions/transaction.module';
import { CommissionsModule } from './commissions/commissions.module';
import { TaxesModule } from './taxes/taxes.module';

@Module({
  imports: [NatsModule, ExpensesModule, IncomesModule, FinancialReportModule, TransactionsModule, CommissionsModule, TaxesModule],
})
export class AppModule {}
console.log(envs);
