import { Module } from '@nestjs/common';
import { envs } from './config';
import { NatsModule } from './transports';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [ProductsModule, NatsModule],  
})
export class AppModule {}
