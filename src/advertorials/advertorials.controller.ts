import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAdvertorialDto } from 'src/common/dto/contentManagment/advertorials/create-advertorial.dto';
import { CreateCategoryDto } from 'src/common/dto/contentManagment/advertorials/create-category.dto';
import { UpdateAdvertorialDto } from 'src/common/dto/contentManagment/advertorials/update-advertorial.dto';
import { UpdateCategoryDto } from 'src/common/dto/contentManagment/faqs/update-category.dto';
import { NATS_SERVICE } from 'src/config/services';

@Controller('advertorials')
export class AdvertorialsController {
    constructor(
        @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    ) { }

    /************************************************************************************/
    /** PUBLIREPORTAJES **/

    // Obtener todos los publireportajes
    @Get()
    async getAllAdvertorials() {
        return this.client.send('get_all_advertorials', {});
    }

    // Buscar publireportajes por título
    @Get('search')
    async searchAdvertorials(@Query('query') query: string) {
        if (!query) {
            throw new Error('Query parameter must be a valid string');
        }
        return this.client.send('search_advertorials', { query });
    }

    // Crear un nuevo publireportaje
    @Post()
    async createAdvertorial(@Body() createAdvertorialDto: CreateAdvertorialDto) {
        return this.client.send('create_advertorial', {...createAdvertorialDto});
    }

    // Actualizar un publireportaje existente
    @Put(':advertorialId')
    async updateAdvertorial(
        @Param('advertorialId') advertorialId: string,
        @Body() updateAdvertorialDto: UpdateAdvertorialDto,
    ) {
        return this.client.send('update_advertorial', { advertorialId, ...updateAdvertorialDto});
    }

    // Eliminar un publireportaje
    @Delete(':advertorialId')
    async deleteAdvertorial(@Param('advertorialId') advertorialId: string) {
        return this.client.send('delete_advertorial', { advertorialId });
    }

    // Actualizar el estado de un publireportaje
    @Put(':advertorialId/status')
    async updateAdvertorialStatus(
        @Param('advertorialId') advertorialId: string,
        @Body('status') status: 'approved' | 'rejected',
    ) {
        if (!['approved', 'rejected'].includes(status)) {
            throw new Error('Invalid status value');
        }
        return this.client.send('update_advertorial_status', { advertorialId, status });
    }

    // Obtener publireportajes por estado
    @Get('status/:status')
    async getAdvertorialsByStatus(@Param('status') status: string) {
        if (!['approved', 'pending'].includes(status)) {
            throw new Error('El parámetro status debe ser "approved" o "pending"');
        }
        return this.client.send('get_advertorials_by_status', { status });
    }

    // Obtener un publireportaje por advertorialId
    @Get(':advertorialId')
    async getAdvertorialById(@Param('advertorialId') advertorialId: string) {
        return this.client.send('get_advertorial_by_id', { advertorialId });
    }

    // Programar la publicación de un publireportaje
    @Post(':advertorialId/schedule')
    async schedulePublication(
        @Param('advertorialId') advertorialId: string,
        @Body('publishDate') publishDate: Date,
    ) {
        return this.client.send('schedule_advertorial_publication', { advertorialId, publishDate });
    }

    /************************************************************************************/
    /** CATEGORÍAS **/

    // Obtener todas las categorías
    @Get('categories')
    async getAllCategories() {
        return this.client.send('get_all_categories', {});
    }

    // Crear una nueva categoría
    @Post('categories')
    async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.client.send('create_category', {...createCategoryDto});
    }

    // Actualizar una categoría existente
    @Put('categories/:id')
    async updateCategory(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.client.send('update_category', { id, ...updateCategoryDto });
    }

    // Eliminar una categoría
    @Delete('categories/:id')
    async deleteCategory(@Param('id') id: number) {
        return this.client.send('delete_category', { id });
    }

    // Obtener publireportajes por categoría
    @Get('categories/:categoryId/advertorials')
    async getAdvertorialsByCategory(@Param('categoryId') categoryId: number) {
        return this.client.send('get_advertorials_by_category', { categoryId });
    }
}