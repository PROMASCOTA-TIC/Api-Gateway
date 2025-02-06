import { Controller, Post, Body, Get, Query, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ChatbotFeedbackDto, ChatMessageDto } from 'src/common/dto/contentManagment/chatbot/chat-feedback.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('chatbot')
export class ChatbotController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) { }

    /** 🔹 Obtener respuesta del chatbot */
    @Post('chat')
    async getChatResponse(@Body() chatMessageDto: ChatMessageDto) {
        if (!chatMessageDto.message) {
            throw new BadRequestException('El mensaje no puede estar vacío');
        }

        try {
            const response = await this.client.send('chatbot_response', { message: chatMessageDto.message }).toPromise();
            return { response };
        } catch (error) {
            throw new BadRequestException('Error al obtener la respuesta del chatbot');
        }
    }

    /** 🔹 Registrar feedback */
    @Post('feedback')
    async registerFeedback(@Body() feedbackDto: ChatbotFeedbackDto) {
        return this.client.send('chatbot_feedback', { feedbackId: feedbackDto.feedbackId, rating: feedbackDto.rating }).toPromise();
    }

    /** 🔹 Obtener estadísticas del chatbot en un rango de fechas */
    @Get('stats')
    async getWeeklyStats(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
        if (!startDate || !endDate) {
            throw new BadRequestException('Debe proporcionar startDate y endDate en formato YYYY-MM-DD');
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            throw new BadRequestException('Las fechas proporcionadas no son válidas');
        }

        if (parsedStartDate > parsedEndDate) {
            throw new BadRequestException('startDate no puede ser mayor que endDate');
        }

        try {
            return await this.client.send('chatbot_stats', { startDate, endDate }).toPromise();
        } catch (error) {
            throw new BadRequestException('Error al obtener estadísticas del chatbot');
        }
    }
}
