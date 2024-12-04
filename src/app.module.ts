import { Module } from '@nestjs/common';
import { ExpensesModule } from './expenses/expenses.module';
import { NatsModule } from './transports/nats.module';
import { envs } from './config';

@Module({
  imports: [ExpensesModule, NatsModule],
})
export class AppModule {}
console.log(envs);
