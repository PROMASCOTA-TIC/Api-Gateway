import { Module } from '@nestjs/common';
import { TransactionsController } from './transaction.controller';
import { NatsModule } from 'src/transports';

@Module({
  imports: [NatsModule],
  controllers: [TransactionsController],
  providers: [],
})
export class TransactionsModule {}
