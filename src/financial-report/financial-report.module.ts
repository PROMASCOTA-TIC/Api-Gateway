import { Module } from '@nestjs/common';
import { FinancialReportController } from './financial-report.controller';
import { NatsModule } from 'src/transports';

@Module({
  controllers: [FinancialReportController],
  providers: [],
  imports: [NatsModule],
})
export class FinancialReportModule {}
