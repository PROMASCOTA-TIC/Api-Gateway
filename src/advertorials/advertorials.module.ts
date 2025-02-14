import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports';
import { AdvertorialsController } from './advertorials.controller';

@Module({
  controllers: [AdvertorialsController],
  providers: [],
  imports: [NatsModule],
})
export class AdvertorialsModule {}
