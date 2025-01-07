import { Module } from '@nestjs/common';
import { NatsModule } from 'src/transports';
import { ChatbotController } from './chatbot.controller';

@Module({
  controllers: [ChatbotController],
  providers: [],
  imports: [NatsModule],
})
export class ChatbotModule {}
