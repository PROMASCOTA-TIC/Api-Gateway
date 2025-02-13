import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { IsOptional } from 'class-validator';
import { CreateOrderDto } from 'src/common/dto/order/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject('NATS_SERVICE') private readonly client: ClientProxy,
  ) { }

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('create_order', createOrderDto);
  }

  @Get('all')
  async findAll() {
    return this.client.send('get_all_orders', {});
  }

  @Get()
  async findAllByUser(@Query('userId') userId: string) {
    return this.client.send('get_all_user_orders', { userId });
  }

  @Patch(':id')
  async orderPaid(@Param('id') id: string, @Body() body: { userId: string, paymentComment: string }) {
    const payload = { id, userId: body.userId, paymentComment: body.paymentComment };
    return this.client.send('order_paid', payload);
  }

  @Post(':id')
  async findOne(@Param('id') id: string, @Body('userId') userId?: string) {
    const payload = { id, userId };
    return this.client.send('get_one_user_order', payload);
  }

  @Patch(':id/item/:orderItemId')
  async changeOrderItemStatus(
    @Param('id') id: string,
    @Param('orderItemId') orderItemId: string,
    @Body() body?: { userId: string }
  ) {
    const payload = { id, orderItemId, ...body };
    return this.client.send('change_order_item_status', payload);
  }

  @Get('orderItemsEntrepreneur')
  async getItemsByEntrepreneur() {
    return this.client.send('get_items_by_entrepreneur', { });
  }

  @Get('orderItemsPetOwner')
  async getItemsByPetOwner() {
    return this.client.send('get_items_by_petOwner', {});
  }

  @Get(':entrepreneurId/orders')
  async getOrdersByEntrepreneur(@Param('entrepreneurId') entrepreneurId: string) {
    return this.client.send('get_orders_by_entrepreneur', { entrepreneurId });
  }
}
