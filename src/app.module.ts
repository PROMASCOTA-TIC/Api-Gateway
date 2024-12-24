import { Module } from '@nestjs/common';
import { envs } from './config';
import { NatsModule } from './transports';
import { UsersModule } from './users/users.module';

@Module({
  imports: [NatsModule,UsersModule],
})
export class AppModule {}
console.log(envs);
