import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePetDto, UpdatePetDto } from 'src/common';

@Controller('pets')
export class PetsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createPetDto: CreatePetDto) {
    return this.client.send('create_pet', createPetDto );
  }

  @Get()
  findAll() {
    return this.client.send('find_all_pets',{ });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send('find_one_pet', id );
  }

  @Patch(':id')
  update(@Body() updatePetDto: UpdatePetDto) {
    return this.client.send('update_pet', updatePetDto );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.client.send('remove_pet', id );
  }
}
