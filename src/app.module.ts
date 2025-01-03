import { Module } from '@nestjs/common';
import { envs } from './config';
import { NatsModule } from './transports';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { FinancialReportModule } from './financial-report/financial-report.module';
import { TransactionsModule } from './transactions/transaction.module';
import { CommissionsModule } from './commissions/commissions.module';
import { TaxesModule } from './taxes/taxes.module';
import { OffersModule } from './offers/offers.module';

@Module({
  imports: [NatsModule, ExpensesModule, IncomesModule, FinancialReportModule, TransactionsModule, CommissionsModule, TaxesModule, UsersModule, AuthModule, ProductsModule,OffersModule],
})
export class AppModule {}
console.log(envs);
