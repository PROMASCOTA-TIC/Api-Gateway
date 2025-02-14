import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports';
import { LinksController } from './links.controller';

@Module({
  controllers: [LinksController],
  providers: [],
  imports: [NatsModule],
})
export class LinksModule {}
