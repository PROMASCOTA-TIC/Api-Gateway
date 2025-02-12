import { Module } from '@nestjs/common';
import { PetsController } from './pets.controller';
import { NatsModule } from 'src/transports';

@Module({
  controllers: [PetsController],
  providers: [],
  imports: [NatsModule],
})
export class PetsModule {}
