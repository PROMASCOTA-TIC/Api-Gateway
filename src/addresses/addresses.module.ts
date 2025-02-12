import { Module } from '@nestjs/common';
import { AddressesController } from './addresses.controller';
import { NatsModule } from 'src/transports';

@Module({
  imports: [NatsModule],
  controllers: [AddressesController],
  providers: [],
})
export class AddressesModule {}
