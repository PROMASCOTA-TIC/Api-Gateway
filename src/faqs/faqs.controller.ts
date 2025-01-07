import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
    @Get()
    async getAllFaqs() {
        return this.client.send('get_all_faqs', {});
    }

    @Get('search')
    async searchFaqs(@Query('query') query: string) {
        return this.client.send('search_faqs', { query });
    }

    @Post()
    async createFaq(@Body() createFaqDto: CreateFaqDto) {
        return this.client.send('create_faq', {...createFaqDto});
    }

    @Put(':faqId')
    async updateFaq(@Param('faqId') faqId: string, @Body() updateFaqDto: UpdateFaqDto) {
        return this.client.send('update_faq', { faqId, ...updateFaqDto });
    }

    @Delete(':faqId')
    async deleteFaq(@Param('faqId') faqId: string) {
        return this.client.send('delete_faq', { faqId });
    }

    @Get(':faqId')
    async getFaqById(@Param('faqId') faqId: string) {
        return this.client.send('get_faq_by_id', { faqId });
    }

    /** Categorías */
    @Get('categories')
    async getAllCategories() {
        return this.client.send('get_all_categories', {});
    }

    @Post('categories')
    async createCategory(@Body() data: any) {
        return this.client.send('create_category', data);
    }

    @Put('categories/:id')
    async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.client.send('update_category', { id, ...updateCategoryDto });
    }

    @Delete('categories/:id')
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