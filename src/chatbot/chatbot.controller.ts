import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChatMessageDto } from 'src/common/dto/contentManagment/chatbot/chat-message.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('chatbot')
export class ChatbotController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) { }

    @Post('chat')
    async getChatResponse(@Body() chatMessageDto: ChatMessageDto): Promise<string> {
        const { message } = chatMessageDto;
        // Envía el mensaje al microservicio y espera la respuesta
        return this.client.send('chatbot_response', { message }).toPromise();
    }
}
