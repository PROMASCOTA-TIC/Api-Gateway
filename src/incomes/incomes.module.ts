import { Module } from '@nestjs/common';
import { IncomesController } from './incomes.controller';
import { NatsModule } from 'src/transports';

@Module({
  controllers: [IncomesController],
  providers: [],
  imports: [NatsModule],
})
export class IncomesModule {}
