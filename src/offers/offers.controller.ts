import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Body,
    Param,
    HttpException,
    HttpStatus,
    Inject,
    BadRequestException,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  import { lastValueFrom } from 'rxjs';
  import { CreateOfferDto } from 'src/common/entrepreneurs/dto/create-offer.dto';
  import { UpdateOfferDto } from 'src/common/entrepreneurs/dto/update-offer.dto';
  
  @Controller('offers')
  export class OffersController {
    constructor(
      @Inject('NATS_SERVICE') private readonly client: ClientProxy, // Inyección del cliente NATS
    ) {}
  
    /**
     * Crear una nueva oferta.
     * Publica un mensaje en NATS para el microservicio de ofertas.
     * @param createOfferDto - Datos para crear la oferta.
     * @returns La oferta creada.
     */
    @Post()
    async create(@Body() createOfferDto: CreateOfferDto) {
      try {
        const response = await lastValueFrom(
          this.client.send('create_offer', createOfferDto),
        );
        return response;
      } catch (error) {
        console.error('Error creando la oferta:', error.message);
        throw new HttpException(
          'Error creando la oferta: ' + error.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
    /**
     * Obtener todas las ofertas.
     * Publica un mensaje en NATS para el microservicio de ofertas.
     * @returns Lista de ofertas.
     */
    @Get()
    async findAll() {
      try {
        const response = await lastValueFrom(
          this.client.send('get_all_offers', {}),
        );
        return response;
      } catch (error) {
        console.error('Error obteniendo las ofertas:', error.message);
        throw new HttpException(
          'Error obteniendo las ofertas: ' + error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  
    /**
     * Obtener una oferta por ID.
     * Publica un mensaje en NATS para el microservicio de ofertas.
     * @param id - ID de la oferta.
     * @returns La oferta encontrada.
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {
      try {
        const response = await lastValueFrom(
          this.client.send('get_offer_by_id', { id }),
        );
        return response;
      } catch (error) {
        console.error('Error obteniendo la oferta:', error.message);
        throw new HttpException(
          'Error obteniendo la oferta: ' + error.message,
          HttpStatus.NOT_FOUND,
        );
      }
    }
  
    /**
     * Actualizar una oferta por ID.
     * Publica un mensaje en NATS para el microservicio de ofertas.
     * @param id - ID de la oferta.
     * @param updateOfferDto - Datos para actualizar la oferta.
     * @returns La oferta actualizada.
     */
    @Patch(':id')
    async update(
      @Param('id') id: string,
      @Body() updateOfferDto: UpdateOfferDto,
    ) {
      try {
        const response = await lastValueFrom(
          this.client.send('update_offer', { id, dto: updateOfferDto }),
        );
        return response;
      } catch (error) {
        console.error('Error actualizando la oferta:', error.message);
        throw new HttpException(
          'Error actualizando la oferta: ' + error.message,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  
 /**
 * Endpoint para eliminar una oferta por ID.
 * Publica un mensaje en NATS para el microservicio de ofertas.
 * @param id - ID de la oferta.
 * @returns Confirmación de eliminación.
 */
@Delete(':id')
async remove(@Param('id') id: string) {
  try {
    const response = await lastValueFrom(
      this.client.send('delete_offer', id),
    );
    return response; // Devuelve la respuesta directamente
  } catch (error) {
    throw new BadRequestException(
      'Error eliminando la oferta: ' + error.message,
    );
  }
}

  }
  