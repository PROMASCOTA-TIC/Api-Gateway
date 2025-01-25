import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { NatsModule } from 'src/transports';

@Module({
  controllers: [PaymentsController],
  providers: [],
  imports: [NatsModule],
})
export class PaymentsModule {}
