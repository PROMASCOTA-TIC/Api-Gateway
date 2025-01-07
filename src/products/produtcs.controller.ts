import { 
  Body, 
  Controller, 
  Get, 
  Inject, 
  Post, 
  Param, 
  Delete, 
  Patch, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateProductDto } from 'src/common/entrepreneurs/dto/create-product.dto';
import { UpdateProductDto } from 'src/common/entrepreneurs/dto/update-product.dto';
import { NATS_SERVICE } from 'src/config/services';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}


  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const response = await lastValueFrom(
        this.client.send('create_product', createProductDto),
      );
      return response;
    } catch (error) {
      console.error('Error al crear el producto:', error.message);
      throw new HttpException(
        'Error creating product: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Get()
  async findAll() {
    try {
      const response = await lastValueFrom(
        this.client.send('get_all_products', {}),
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los productos:', error.message);
      throw new HttpException(
        'Error retrieving products: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.client.send('get_product_by_id', { id }),
      );
      return response;
    } catch (error) {
      console.error('Error al obtener el producto:', error.message);
      throw new HttpException(
        'Error retrieving product: ' + error.message,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      const response = await lastValueFrom(
        this.client.send('update_product', { id, dto: updateProductDto }),
      );
      return response;
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
      throw new HttpException(
        'Error updating product: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.client.send('delete_product', { id }),
      );
      return response;
    } catch (error) {
      console.error('Error al eliminar el producto:', error.message);
      throw new HttpException(
        'Error deleting product: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  @Patch(':id/price')
  async updatePrice(@Param('id') id: string, @Body() body: { price: number }) {
    try {
      const response = await lastValueFrom(
        this.client.send('update_product_price', { id, price: body.price }),
      );
      return response;
    } catch (error) {
      console.error('Error al actualizar el precio del producto:', error.message);
      throw new HttpException(
        'Error updating product price: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/entrepreneur/:entrepreneurId')
  async findAllByEntrepreneur(@Param('entrepreneurId') entrepreneurId: string) {
    try {
      const response = await lastValueFrom(
        this.client.send('get_products_by_entrepreneur', entrepreneurId),
      );
      return response;
    } catch (error) {
      console.error(`Error al obtener productos del emprendedor con ID ${entrepreneurId}: ${error.message}`);
      throw new HttpException(
        `Error al obtener productos del emprendedor: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  
}
