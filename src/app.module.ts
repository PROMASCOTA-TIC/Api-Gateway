import { Module } from '@nestjs/common';
import { envs } from './config';
import { NatsModule } from './transports';
import { ProductsModule } from './products/products.module';
import { OffersModule } from './offers/offers.module';

@Module({
  imports: [ProductsModule, NatsModule,OffersModule],  
})
export class AppModule {}
