import { Body, Controller, Get, Inject, Post, Param, Delete, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto, UpdateProductDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  /**
   * Endpoint para crear un nuevo producto.
   * Publica un mensaje en NATS para el microservicio de productos.
   * @param createProductDto - Datos para crear el producto.
   * @returns El producto creado.
   */
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const response = await this.client.send('create_product', createProductDto).toPromise();
      return response;
    } catch (error) {
      console.error('Error al crear el producto:', error.message);
      throw new HttpException(
        'Error creating product: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Endpoint para obtener todos los productos.
   * Publica un mensaje en NATS para el microservicio de productos.
   * @returns Lista de productos.
   */
  @Get()
  async findAll() {
    try {
      const response = await this.client.send('get_all_products', {}).toPromise();
      return response;
    } catch (error) {
      console.error('Error al obtener los productos:', error.message);
      throw new HttpException(
        'Error retrieving products: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Endpoint para obtener un producto por ID.
   * Publica un mensaje en NATS para el microservicio de productos.
   * @param id - ID del producto.
   * @returns El producto encontrado.
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const response = await this.client.send('get_product_by_id', id).toPromise();
      return response;
    } catch (error) {
      console.error('Error al obtener el producto:', error.message);
      throw new HttpException(
        'Error retrieving product: ' + error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Endpoint para actualizar un producto por ID.
   * Publica un mensaje en NATS para el microservicio de productos.
   * @param id - ID del producto.
   * @param updateProductDto - Datos para actualizar el producto.
   * @returns El producto actualizado.
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const response = await this.client
        .send('update_product', { id, dto: updateProductDto })
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
      throw new HttpException(
        'Error updating product: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Endpoint para eliminar un producto por ID.
   * Publica un mensaje en NATS para el microservicio de productos.
   * @param id - ID del producto.
   * @returns Una confirmación de eliminación.
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const response = await this.client.send('delete_product', id).toPromise();
      return response;
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
      throw new HttpException(
        'Error deleting product: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}