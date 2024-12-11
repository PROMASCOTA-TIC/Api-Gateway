import { Body, Controller, Get, Inject, Post, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateProductDto } from 'src/common/dto/entrepreneurs/create-product.dto';
import { UpdateProductDto } from 'src/common/dto/entrepreneurs/update-product.dto';
import { NATS_SERVICE } from 'src/config';


@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  /**
   * Endpoint para crear un nuevo producto.
   * Recibe la solicitud del cliente y la envía al microservicio de Products.
   * @param createProductDto - Datos para crear el producto.
   * @returns El producto creado.
   */
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    // Enviar el mensaje NATS para crear un producto
    return this.client.send('create_product', { ...createProductDto });
  }

  /**
   * Endpoint para obtener todos los productos.
   * @returns Lista de productos.
   */
  @Get()
  findAll() {
    // Enviar el mensaje NATS para obtener todos los productos
    return this.client.send('find_all_products', {});
  }

  /**
   * Endpoint para obtener un producto por ID.
   * @param id - ID del producto.
   * @returns El producto encontrado.
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Enviar el mensaje NATS para obtener un producto por su ID
    return this.client.send('find_product_by_id', { id });
  }

  /**
   * Endpoint para actualizar un producto.
   * @param id - ID del producto.
   * @param updateProductDto - Datos para actualizar el producto.
   * @returns El producto actualizado.
   */
  @Post(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    // Enviar el mensaje NATS para actualizar el producto
    return this.client.send('update_product', { id, ...updateProductDto });
  }
}
