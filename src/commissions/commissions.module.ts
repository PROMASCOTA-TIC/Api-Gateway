import { Module } from '@nestjs/common';
import { CommissionsController } from './commissions.controller';
import { NatsModule } from 'src/transports';

@Module({
  imports: [NatsModule],
  controllers: [CommissionsController],
  providers: [],
})
export class CommissionsModule {}
