import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping-cart.controller';
import { NatsModule } from 'src/transports';

@Module({
  controllers: [ShoppingCartController],
  providers: [],
  imports: [NatsModule],
})
export class ShoppingCartModule {}
