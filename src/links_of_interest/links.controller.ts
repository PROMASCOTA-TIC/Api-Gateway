import { Controller, Get, Post, Put, Delete, Param, Body, Query, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
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
  @Get()
  async getAllLinks() {
    return this.client.send('get_all_links', {});
  }

  // Buscar enlaces por título
  @Get('search')
  async searchLinks(@Query('query') query: string) {
    return this.client.send('search_links', { query });
  }

  // Crear un nuevo enlace
  @Post()
  async createLink(@Body() createLinkDto: CreateLinkDto) {
    if (!createLinkDto.linkId || !createLinkDto.ownerName || !createLinkDto.title || !createLinkDto.description || !createLinkDto.sourceLink) {
      throw new Error('Faltan campos obligatorios en la creación del enlace');
    }
    return this.client.send('create_link', { ...createLinkDto });
  }

  // Actualizar un enlace existente
  @Put(':linkId')
  async updateLink(@Param('linkId') linkId: string, @Body() updateLinkDto: UpdateLinkDto) {
    return this.client.send('update_link', { linkId, ...updateLinkDto });
  }

  // Eliminar un enlace
  @Delete(':linkId')
  async deleteLink(@Param('linkId') linkId: string) {
    return this.client.send('delete_link', { linkId });
  }

  // Actualizar el estado de un enlace
  @Put(':linkId/status')
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
  @Get(':linkId')
  async getLinkById(@Param('linkId') linkId: string) {
    return this.client.send('get_link_by_id', { linkId });
  }

  // Programar la publicación de un enlace
  @Post(':linkId/schedule')
  async schedulePublication(@Param('linkId') linkId: string, @Body('publishDate') publishDate: Date) {
    if (!publishDate) {
      throw new Error('Debe proporcionarse una fecha de publicación');
    }
    return this.client.send('schedule_link_publication', { linkId, publishDate });
  }

  /************************************************************************************/
  /** CATEGORIAS **/

  // Obtener todas las categorías
  @Get('categories')
  async getAllCategories() {
    return this.client.send('get_all_categories', {});
  }

  // Crear una nueva categoría
  @Post('categories')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    if (!createCategoryDto.name) {
      throw new Error('El nombre de la categoría es obligatorio');
    }
    return this.client.send('create_category', { ...createCategoryDto });
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

  // Obtener enlaces por categoría
  @Get('categories/:categoryId/links')
  async getLinksByCategory(@Param('categoryId') categoryId: number) {
    return this.client.send('get_links_by_category', { categoryId });
  }

  /************************************************************************************/
  /** DESCARGAR ENLACES EN PDF **/

  @Get(':linkId/download-pdf')
  async downloadLinkAsPDF(@Param('linkId') linkId: string) {
    const pdfResponse = await this.client.send('download_link_as_pdf', { linkId }).toPromise();
    if (!pdfResponse || !pdfResponse.pdfBuffer) {
      throw new Error('No se pudo generar el PDF');
    }
    return {
      filename: pdfResponse.filename,
      pdfBuffer: pdfResponse.pdfBuffer,
    };
  }
}