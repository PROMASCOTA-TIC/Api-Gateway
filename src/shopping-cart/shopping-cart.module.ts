import { Module } from '@nestjs/common';
import { ShoppingCartController } from './shopping-cart.controller';
import { Client, ClientsModule, Transport } from '@nestjs/microservices';
import { SHOPPING_CART_SERVICE } from 'src/config/services';
import { envs } from 'src/config';

@Module({
  controllers: [ShoppingCartController],
  providers: [],
  imports: [
    ClientsModule.register([
      { 
        name: SHOPPING_CART_SERVICE, 
        transport: Transport.TCP,
        options: {
          host: envs.shoppingCartMicroserviceHost,
          port: envs.shoppingCartMicroservicePort,
        },
      },
    ]),
  ],
})
export class ShoppingCartModule {}
