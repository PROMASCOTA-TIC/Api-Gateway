import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { NatsModule } from './transports/nats.module';
import { envs } from './config';
import { IncomesModule } from './incomes/incomes.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { FinancialReportModule } from './financial-report/financial-report.module';
import { TransactionsModule } from './transactions/transaction.module';
import { CommissionsModule } from './commissions/commissions.module';
import { TaxesModule } from './taxes/taxes.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PetsModule } from './pets/pets.module';

@Module({
  imports: [
    NatsModule, 
    ExpensesModule, IncomesModule, FinancialReportModule, TransactionsModule, CommissionsModule, TaxesModule, 
    UsersModule, AuthModule, 
    ShoppingCartModule, PetsModule],
})
export class AppModule {}
console.log(envs);
