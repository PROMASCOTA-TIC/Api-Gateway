import { Module } from '@nestjs/common';
import { envs } from './config';
import { NatsModule } from './transports';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [NatsModule,UsersModule,AuthModule,ProductsModule],
})
export class AppModule {}
console.log(envs);
