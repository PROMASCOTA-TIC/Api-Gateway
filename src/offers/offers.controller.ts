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
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateOfferDto } from 'src/common/entrepreneurs/dto/create-offer.dto';
import { UpdateOfferDto } from 'src/common/entrepreneurs/dto/update-offer.dto';

@Controller('offers')
export class OffersController {
  private readonly logger = new Logger(OffersController.name);
  constructor(
    @Inject('NATS_SERVICE') private readonly client: ClientProxy, // Inyección del cliente NATS
  ) {}

  /**
   * Crear una nueva oferta.
   */

  @Post()
  async create(@Body() createOfferDto: CreateOfferDto) {
    this.logger.log(`Sending create_offer request for productId: ${createOfferDto.productId}`);
    try {
      const response = await lastValueFrom(
        this.client.send('create_offer', createOfferDto),
      );
      this.logger.log('Offer creation successful:', response);
      return { status: 'success', data: response };
    } catch (error) {
      this.logger.error('Error creating offer:', error.message);
      throw new HttpException(
        `Error creating offer: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
  

  /**
   * Obtener todas las ofertas.
   */
  @Get()
  async findAll() {
    try {
      const response = await lastValueFrom(
        this.client.send('get_all_offers', {}),
      );
      return { status: 'success', data: response };
    } catch (error) {
      console.error('Error obteniendo las ofertas:', error.message);
      throw new HttpException(
        `Error obteniendo las ofertas: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Obtener una oferta por ID.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      throw new BadRequestException('El ID proporcionado no es válido.');
    }
    try {
      const response = await lastValueFrom(
        this.client.send('get_offer_by_id', { id }),
      );
      return { status: 'success', data: response };
    } catch (error) {
      console.error('Error obteniendo la oferta:', error.message);
      throw new HttpException(
        `Error obteniendo la oferta: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Actualizar una oferta por ID.
   */
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOfferDto: UpdateOfferDto,
  ) {
    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      throw new BadRequestException('El ID proporcionado no es válido.');
    }
    try {
      const response = await lastValueFrom(
        this.client.send('update_offer', { id, dto: updateOfferDto }),
      );
      return { status: 'success', data: response };
    } catch (error) {
      console.error('Error actualizando la oferta:', error.message);
      throw new HttpException(
        `Error actualizando la oferta: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Eliminar una oferta por ID.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      throw new BadRequestException('El ID proporcionado no es válido.');
    }
    try {
      const response = await lastValueFrom(
        this.client.send('delete_offer', id),
      );
      return { status: 'success', data: response };
    } catch (error) {
      console.error('Error eliminando la oferta:', error.message);
      throw new BadRequestException(
        `Error eliminando la oferta: ${error.message}`,
      );
    }
  }
}
