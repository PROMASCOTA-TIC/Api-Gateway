import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { NatsModule } from 'src/transports';

@Module({
  controllers: [ExpensesController],
  providers: [],
  imports: [NatsModule],
})
export class ExpensesModule {}
