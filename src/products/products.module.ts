import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports';
import { ProductsController } from './produtcs.controller';

@Module({
  controllers: [ProductsController],
  providers: [],
  imports: [NatsModule],
})
export class ProductsModule {}