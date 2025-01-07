import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject, BadRequestException, Patch, HttpStatus, Res, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateCategoryDto } from 'src/common/dto/contentManagment/advertorials/create-category.dto';
import { UpdateCategoryDto } from 'src/common/dto/contentManagment/faqs/update-category.dto';
import { CreateLinkDto } from 'src/common/dto/contentManagment/links_of_interest/create-link.dto';
import { UpdateLinkDto } from 'src/common/dto/contentManagment/links_of_interest/update-link.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('links')
export class LinksController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  /************************************************************************************/
  /** ENLACES **/

  // Obtener todos los enlaces
  @Get('all')
  async getAllLinks() {
    return this.client.send('get_all_links', {});
  }

  // Buscar enlaces por título
  @Get('search')
  async searchLinks(@Query('query') query: string) {
    if (!query) {
      throw new Error('Query parameter must be a valid string');
    }
    return this.client.send('search_links', { query });
  }

  // Crear un nuevo enlace
  @Post('create')
  async createLink(@Body() createLinkDto: CreateLinkDto) {
    if (!createLinkDto.ownerName || !createLinkDto.title || !createLinkDto.description || !createLinkDto.sourceLink) {
      throw new Error('Faltan campos obligatorios en la creación del enlace');
    }
    return this.client.send('create_link', { ...createLinkDto });
  }

  // Actualizar un enlace existente
  @Put('update/:linkId')
  async updateLink(@Param('linkId') linkId: string, @Body() updateLinkDto: UpdateLinkDto) {
    if (!updateLinkDto) {
      throw new BadRequestException('Debe proporcionar los datos de actualización.');
    }
    return await lastValueFrom(this.client.send('update_link', { linkId, updateLinkDto }));
  }

  // Eliminar un enlace
  @Delete('delete/:linkId')
  async deleteLink(@Param('linkId') linkId: string) {
    return this.client.send('delete_link', { linkId });
  }

  // Actualizar el estado de un enlace
  @Patch('update-status/:linkId')
  async updateLinkStatus(@Param('linkId') linkId: string, @Body('status') status: 'approved' | 'rejected') {
    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('Estado inválido: debe ser "approved" o "rejected"');
    }
    return this.client.send('update_link_status', { linkId, status });
  }

  // Obtener enlaces por estado
  @Get('status/:status')
  async getLinksByStatus(@Param('status') status: string) {
    if (!['approved', 'pending'].includes(status)) {
      throw new Error('Estado inválido: debe ser "approved" o "pending"');
    }
    return this.client.send('get_links_by_status', { status });
  }

  // Obtener un enlace por ID
  @Get('detail/:linkId')
  async getLinkById(@Param('linkId') linkId: string) {
    return this.client.send('get_link_by_id', { linkId });
  }

  // Programar la publicación de un enlace
  @Post('schedule/:linkId')
  async schedulePublication(@Param('linkId') linkId: string, @Body('publishDate') publishDate: Date) {
    if (!publishDate) {
      throw new Error('Debe proporcionarse una fecha de publicación');
    }

    try {
      const response = await lastValueFrom(
        this.client.send('schedule_link_publication', { linkId, publishDate })
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
  /** CATEGORIAS **/

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

  // Obtener enlaces por categoría
  @Get('categories/:categoryId/links')
  async getLinksByCategory(@Param('categoryId') categoryId: number) {
    return this.client.send('get_links_by_category', { categoryId });
  }

  /************************************************************************************/
  // Descargar enlace como PDF
  @Get('download/:linkId/pdf')
  async downloadLinkAsPDF(@Param('linkId') linkId: string, @Res() res: Response) {
    try {
      const response = await lastValueFrom(
        this.client.send('download_pdf', { linkId })
      );

      if (response.status !== 200) {
        throw new HttpException(response.message || 'Error al generar PDF', HttpStatus.BAD_REQUEST);
      }

      // Enviar el PDF como respuesta
      const pdfBuffer = Buffer.from(response.data, 'base64'); // Decodificar el PDF desde Base64
      res.setHeader('Content-Type', response.contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${response.filename}"`);
      res.send(pdfBuffer);
    } catch (error) {
      throw new HttpException(error.message || 'Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}