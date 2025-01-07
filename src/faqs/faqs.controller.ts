import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateCategoryDto } from 'src/common/dto/contentManagment/advertorials/create-category.dto';
import { CreateFaqDto } from 'src/common/dto/contentManagment/faqs/create-faq.dto';
import { CreateFeedbackDto } from 'src/common/dto/contentManagment/faqs/create-feedback.dto';
import { UpdateCategoryDto } from 'src/common/dto/contentManagment/faqs/update-category.dto';
import { UpdateFaqDto } from 'src/common/dto/contentManagment/faqs/update-faq.dto';
import { NATS_SERVICE } from 'src/config/services';

@Controller('faqs')
export class FaqsController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) { }

    /** FAQs */
    @Get('all')
    async getAllFaqs() {
        return this.client.send('get_all_faqs', {});
    }

    @Get('search')
    async searchFaqs(@Query('query') query: string) {
        if (!query) {
            throw new Error('Query parameter must be a valid string');
        }
        return this.client.send('search_faqs', { query });
    }

    @Post('create')
    async createFaq(@Body() createFaqDto: CreateFaqDto) {
        if (!createFaqDto.categoryId || !createFaqDto.title || !createFaqDto.description) {
            throw new Error('Faltan campos obligatorios en la creación del enlace');
        }
        return this.client.send('create_faq', { ...createFaqDto });
    }

    @Put('update/:faqId')
    async updateFaq(@Param('faqId') faqId: string, @Body() updateFaqDto: UpdateFaqDto) {
        if (!updateFaqDto) {
            throw new BadRequestException('Debe proporcionar los datos de actualización.');
        }
        return await lastValueFrom(this.client.send('update_faq', { faqId, ...updateFaqDto }));
    }

    @Delete('delete/:faqId')
    async deleteFaq(@Param('faqId') faqId: string) {
        return this.client.send('delete_faq', { faqId });
    }

    @Get('detail/:faqId')
    async getFaqById(@Param('faqId') faqId: string) {
        return this.client.send('get_faq_by_id', { faqId });
    }

    /** Categorías */
    @Get('categories/all')
    async getAllCategories() {
        return this.client.send('get_all_categories', {});
    }

    @Post('categories/create')
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        if (!createCategoryDto.name) {
            throw new Error('El nombre de la categoría es obligatorio');
        }
        return this.client.send('create_category', { ...createCategoryDto });
    }

    // Actualizar una categoría existente
    @Put('categories/update/:id')
    async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        const result = await this.client.send('update_category', { id, updateCategoryDto }).toPromise();

        if (!result) {
            throw new Error('No se recibió respuesta del microservicio.');
        }

        return result;
    }

    // Eliminar una categoría
    @Delete('categories/delete/:id')
    async deleteCategory(@Param('id') id: number) {
        return this.client.send('delete_category', { id });
    }

    @Get('categories/:categoryId/faqs')
    async getFaqsByCategory(@Param('categoryId') categoryId: number) {
        return this.client.send('get_faqs_by_category', { categoryId });
    }

    /** Feedback */
    @Post('feedback/:faqId')
    async registerFeedback(@Param('faqId') faqId: string, @Body() createFeedbackDto: CreateFeedbackDto) {
        return this.client.send('register_feedback', { faqId, ...createFeedbackDto });
    }

    @Get('feedback/:faqId/stats')
    async getFeedbackStats(@Param('faqId') faqId: string) {
        return this.client.send('get_feedback_stats', { faqId });
    }

    @Get('feedback/:faqId/summary')
    async getFeedbackSummary(@Param('faqId') faqId: string) {
        return this.client.send('get_feedback_summary', { faqId });
    }

    @Get('feedback/:faqId/details')
    async getFeedbackDetails(@Param('faqId') faqId: string) {
        return this.client.send('get_feedback_details', { faqId });
    }

    @Get('feedback/details/:feedbackId')
    async getFeedbackById(@Param('feedbackId') feedbackId: string) {
        return this.client.send('get_feedback_by_id', { feedbackId });
    }
}