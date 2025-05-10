import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreateAddressDto, UpdateAddressDto } from 'src/common';

@Controller('addresses')
export class AddressesController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.client.send('create_address', { ...createAddressDto });
  }

  @Get()
  findAll() {
    return this.client.send('find_all_addresses', {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('find_one_address', id );
  }

  @Patch(':id')
  update(@Body() updateAddressDto: UpdateAddressDto) {
    return this.client.send('update_address', { ...updateAddressDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send('remove_address', id );
  }
}
