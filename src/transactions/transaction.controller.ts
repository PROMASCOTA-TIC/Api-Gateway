import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTransactionDto, UpdateTransactionDto, UpdateTransferDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';

@Controller('transactions')
export class TransactionsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  createEntrepreneurPayment(@Body() createSettlementDto: CreateTransactionDto) {
    return this.client.send('create_entrepreneur_payment', createSettlementDto);
  }

  @Get()
  findAllEntrepreneurPayments() {
    return this.client.send('find_all_entrepreneur_payments', {});
  }

  @Get(':id')
  findOneEntrepreneurPayment(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find_one_entrepreneur_payment', id);
  }

  @Patch("validate-transfer/:id")
  validateTransfer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrasferDto: UpdateTransferDto
  ) {
    return this.client.send('validate_transfer', {id, updateTrasferDto});
  }

  @Patch(':id')
  updateEntrepreneurPayment(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateTransactionDto: UpdateTransactionDto) {
      console.log('updateTransactionDto', updateTransactionDto);
    return this.client.send('update_entrepreneur_payment', { id, ...updateTransactionDto });
  }  
}
