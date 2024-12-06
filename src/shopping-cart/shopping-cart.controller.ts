import { Controller, Get, Post } from '@nestjs/common';

@Controller('shopping-cart')
export class ShoppingCartController {
  constructor() {}

  @Post()
  createShoppingCart() {
    return 'Shopping cart created';
  }

  @Get()
  getShoppingCart() {
    return 'Shopping cart retrieved';
  }

  @Get('items')
  getShoppingCartItems() {
    return 'Shopping cart items retrieved';
  }
}
