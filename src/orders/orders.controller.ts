import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from 'src/common/dto/order/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('create_order', createOrderDto);
  }

  @Get()
  async findAllByUser(@Query('userId') userId: string) {
    return this.client.send('get_all_user_orders', {userId});
  }

  @Patch(':id')
  async orderPaid(@Param('id') id: string, @Body('userId') userId: string) {
    const payload = {id, userId};
    console.log('payload', payload);
    return this.client.send('order_paid', payload);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.client.send('find_order_by_id', id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.client.send('update_order', { id, ...updateOrderDto });
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.client.send('delete_order', id);
  // }
}
