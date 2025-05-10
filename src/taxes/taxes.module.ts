import { Module } from '@nestjs/common';
import { TaxesController } from './taxes.controller';
import { NatsModule } from 'src/transports';

@Module({
  controllers: [TaxesController],
  providers: [],
  imports: [NatsModule],
})
export class TaxesModule {}
