import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports';
import { FaqsController } from './faqs.controller';

@Module({
  controllers: [FaqsController],
  providers: [],
  imports: [NatsModule],
})
export class FaqsModule {}
