import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { NatsModule } from './transports/nats.module';
import { envs } from './config';
import { IncomesModule } from './incomes/incomes.module';

@Module({
  imports: [ExpensesModule, NatsModule, IncomesModule],
})
export class AppModule {}
console.log(envs);
