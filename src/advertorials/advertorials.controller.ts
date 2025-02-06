import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, BadRequestException, HttpException, HttpStatus, Patch } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
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
    @Get('all')
    async getAllAdvertorials() {
        return this.client.send('get_all_advertorials', {});
    }

    // Buscar publireportajes por título
    @Get('search')
    async searchAdvertorials(@Query('query') query: string) {
        if (!query) {
            return { message: 'El parámetro query no fue enviado en la URL', query };
        }
        return this.client.send('search_advertorials', { query });
    }

    // Crear un nuevo publireportaje
    @Post('create')
    async createAdvertorial(@Body() createAdvertorialDto: CreateAdvertorialDto) {
        if (!createAdvertorialDto.ownerName || !createAdvertorialDto.title || !createAdvertorialDto.description || !createAdvertorialDto.sourceLink) {
            throw new Error('Faltan campos obligatorios en la creación del enlace');
        }
        return this.client.send('create_advertorial', { ...createAdvertorialDto });
    }

    // Actualizar un publireportaje existente
    @Put('update/:advertorialId')
    async updateAdvertorial(@Param('advertorialId') advertorialId: string, @Body() updateAdvertorialDto: UpdateAdvertorialDto,) {
        if (!updateAdvertorialDto) {
            throw new BadRequestException('Debe proporcionar los datos de actualización.');
        }
        return await lastValueFrom(this.client.send('update_advertorial', { advertorialId, updateAdvertorialDto }));
    }

    // Eliminar un publireportaje
    @Delete('delete/:advertorialId')
    async deleteAdvertorial(@Param('advertorialId') advertorialId: string) {
        return this.client.send('delete_advertorial', { advertorialId });
    }

    // Actualizar el estado de un publireportaje
    @Put('update-status/:advertorialId/')
    async updateAdvertorialStatus(
        @Param('advertorialId') advertorialId: string,
        @Body('status') status: 'approved' | 'rejected',
    ) {
        if (!['approved', 'rejected'].includes(status)) {
            throw new Error('Estado inválido: debe ser "approved" o "rejected"');
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
    @Get('detail/:advertorialId')
    async getAdvertorialById(@Param('advertorialId') advertorialId: string) {
        return this.client.send('get_advertorial_by_id', { advertorialId });
    }

    // Programar la publicación de un publireportaje
    @Post('schedule/:advertorialId')
    async schedulePublication(
        @Param('advertorialId') advertorialId: string,
        @Body('publishDate') publishDate: Date) {
        if (!publishDate) {
            throw new Error('Debe proporcionarse una fecha de publicación');
        }

        try {
            const response = await lastValueFrom(
                this.client.send('schedule_advertorial_publication', { advertorialId, publishDate })
            );
            return response;
        } catch (error) {
            throw new HttpException(
                error.message || 'Error al programar la publicación',
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /************************************************************************************/
    /** CATEGORÍAS **/

    // Obtener todas las categorías
    @Get('categories/all')
    async getAllCategories() {
        return this.client.send('get_all_categories', {});
    }

    // Crear una nueva categoría
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

    // Obtener publireportajes por categoría
    @Get('categories/:categoryId/advertorials')
    async getAdvertorialsByCategory(@Param('categoryId') categoryId: number) {
        return this.client.send('get_advertorials_by_category', { categoryId });
    }
}