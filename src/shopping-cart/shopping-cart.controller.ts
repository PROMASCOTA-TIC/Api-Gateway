import { Body, Controller, Delete, Get, Inject, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { DeleteShoppingCartItemDto } from 'src/common';
import { CreateShoppingCartItemDto } from 'src/common/dto/shopping-cart/create-shopping-cart.dto';
import { UpdateShoppingCartItemDto } from 'src/common/dto/shopping-cart/update-shopping-cart.dto';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor(
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createDto: CreateShoppingCartItemDto) {
    return this.client.send('create_shopping_cart', createDto);
  }

  @Get()
  async findAllByUser(@Query('userId', ParseUUIDPipe) userId: string) {
    return this.client.send('get_shopping_cart_by_user', userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateShoppingCartItemDto,
  ) {
    const payload = { id, updateDto };
    return this.client.send('update_shopping_cart_item', payload);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() deleteDto: DeleteShoppingCartItemDto,
  ) {
    const payload = { id, deleteDto };
    return this.client.send('delete_shopping_cart_item', payload);
  }
}
