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
  HttpStatus, 
  Logger
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

  private readonly logger = new Logger(ProductsController.name);


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
  
      // Asegurar que siempre devuelve un JSON con éxito
      return {
        success: true,
        message: "Producto actualizado exitosamente.",
        product: response, // Enviar el producto actualizado
      };
    } catch (error) {
      console.error('Error al actualizar el producto:', error.message);
      throw new HttpException(
        { success: false, message: 'Error updating product: ' + error.message },
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
  

  @Get('/register/pet-types')
  async getPetTypes() {
    try {
      const response = await lastValueFrom(
        this.client.send('get_pet_types', {}), // Asegúrate de usar el nuevo patrón aquí
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los tipos de mascota:', error.message);
      throw new HttpException(
        `Error retrieving pet types: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/entrepreneur/:entrepreneurId/low-stock')
async findLowStockByEntrepreneur(@Param('entrepreneurId') entrepreneurId: string) {
  try {
    this.logger.log(`Obteniendo productos con stock menor a 3 del emprendedor con ID: ${entrepreneurId}`);

    const response = await lastValueFrom(
      this.client.send('get_low_stock_products_by_entrepreneur', entrepreneurId),
    );

    return response;
  } catch (error) {
    this.logger.error(`Error al obtener productos con bajo stock del emprendedor con ID ${entrepreneurId}: ${error.message}`);
    throw new HttpException(
      `Error al obtener productos con bajo stock: ${error.message}`,
      HttpStatus.BAD_REQUEST,
    );
  }
}


  @Get('/register/categories')
  async getCategories() {
    try {
      const response = await lastValueFrom(
        this.client.send('get_categories', {}), // Asegúrate de usar el nuevo patrón aquí
      );
      return response;
    } catch (error) {
      console.error('Error al obtener las categorías:', error.message);
      throw new HttpException(
        `Error retrieving categories: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/register/sub-categories')
  async getSubCategories() {
    try {
      const response = await lastValueFrom(
        this.client.send('get_subcategories', {}),
      );
      return response;
    } catch (error) {
      console.error('Error al obtener las subcategorías:', error.message);
      throw new HttpException(
        `Error retrieving subcategories: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/register/sizes')
  async getSizes() {
    try {
      const response = await lastValueFrom(
        this.client.send('get_sizes', {}),
      );
      return response;
    } catch (error) {
      console.error('Error al obtener los tamaños:', error.message);
      throw new HttpException(
        `Error retrieving sizes: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  @Get('edit/:id')
  async getProductForEdit(@Param('id') id: string) {
    this.logger.log(`Llamada recibida para obtener el producto con ID: ${id} para edición`);
    try {
      // Llamar al microservicio con el patrón correspondiente
      const product = await lastValueFrom(
        this.client.send('get_product_for_edit', id),
      );

      if (!product) {
        this.logger.warn(`Producto no encontrado para el ID: ${id}`);
        throw new HttpException(
          `Producto con ID ${id} no encontrado.`,
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(`Producto obtenido correctamente para edición con ID: ${id}`);
      return product;
    } catch (error) {
      this.logger.error(
        `Error al obtener el producto para edición con ID ${id}: ${error.message}`,
      );
      throw new HttpException(
        `Error al obtener el producto: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
}
