import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTaxDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';

@Controller('taxes')
export class TaxesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  calculateTaxes(@Body() createTaxDto: CreateTaxDto) {
    return this.client.send('create_calculated_tax', {...createTaxDto});
  }

  @Get()
  getTaxes() {
    return this.client.send('find_all_taxes', {});
  }

  @Get(':id')
  getOneTaxById(id: string) {
    return this.client.send('find_one_tax', { id });
  }

}
