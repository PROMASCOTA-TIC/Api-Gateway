import { Body, Controller, Get, Inject, Param, Patch, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePaymentDto } from 'src/common/dto/payment/create-payment.dto';
import { UpdatePaymentDto } from 'src/common/dto/payment/update-payment.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('payments')
export class PaymentsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy, 
  ) {}

  @Post()
  create(
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.client.send('create_payment', { ...createPaymentDto});
  }

  @Get()
  findAll() {
    return this.client.send('find_all_payments', {});
  }

  @Get(':id')
  findOne(
    @Param('id') id: string
  ) {
    return this.client.send('find_one_payment', id);
  }

  @Patch(':id')
  update(
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    return this.client.send('update_payment', { ...updatePaymentDto });
  }
}
