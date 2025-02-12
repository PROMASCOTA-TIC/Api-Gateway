import { Module } from '@nestjs/common';
import { envs } from './config';
import { NatsModule } from './transports';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { ShoppingCartModule } from './shopping-cart/shopping-cart.module';
import { FinancialReportModule } from './financial-report/financial-report.module';
import { TransactionsModule } from './transactions/transaction.module';
import { CommissionsModule } from './commissions/commissions.module';
import { TaxesModule } from './taxes/taxes.module';
import { OffersModule } from './offers/offers.module';
import { PetsModule } from './pets/pets.module';
import { AddressesModule } from './addresses/addresses.module';
import { PaymentsModule } from './payments/payments.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    NatsModule, 
    ExpensesModule, IncomesModule, FinancialReportModule, TransactionsModule, CommissionsModule, TaxesModule, 
    UsersModule, AuthModule, 
    ShoppingCartModule, PetsModule, AddressesModule, PaymentsModule, OrdersModule,
    ProductsModule,OffersModule],
})
export class AppModule {}
console.log(envs);
