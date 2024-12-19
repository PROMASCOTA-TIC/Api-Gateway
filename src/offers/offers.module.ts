import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports';
import { OffersController } from './offers.controller';



@Module({
  controllers: [OffersController],
  providers: [],
  imports: [NatsModule],
})
export class OffersModule {}