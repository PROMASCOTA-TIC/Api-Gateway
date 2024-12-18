import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePetOwnerDto, UpdateAdminDto, UpdatePetOwnerDto } from 'src/common';
import { NATS_SERVICE } from 'src/config';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post('create-pet-owner')
  createPetOwner(@Body() createPetOwnerDto: CreatePetOwnerDto) {
    console.log('createPetOwnerDto', createPetOwnerDto);
    return this.client.send('create_pet_owner', createPetOwnerDto);
  }

  //TODO: Implementar endpoint para crear emprendedor (JP)


  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find_by_id', id);
  }

  @Post('email')
  findByEmil(@Body() email: string) {
    return this.client.send('find_by_id', email);
  }

  @Patch('update-pet-owner')
  updatePetOwner(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updatePetOwnerDto: UpdatePetOwnerDto
  ) {
    return this.client.send(id, updatePetOwnerDto);
  }

  @Patch('update-admin')
  updateAdmin(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateAdminDto: UpdateAdminDto
  ) {
    return this.client.send(id, updateAdminDto);
  }

  // @Patch('update-entrepreneur')
  // updateEntrepreneur(
    
  // ) {
  //   return this.client.send(id, updatePetOwnerDto);
  // }
}
