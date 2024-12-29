import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EmptyError, lastValueFrom } from 'rxjs';
import { CreatePetOwnerDto, UpdateAdminDto, UpdatePetOwnerDto } from 'src/common';
import { CreateEntrepreneurDTO } from 'src/common/dto/global/create-entrepreneur.dto';
import { UpdateEntrepreneurDTO } from 'src/common/dto/global/update-entrepreneur.dto';
import { NATS_SERVICE } from 'src/config/services';


@Controller('users')
export class UsersController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post('create-entrepreneur')
  async createEntrepreneur(@Body() createEntrepreneurDto: CreateEntrepreneurDTO) {
    console.log('Request received in API Gateway:', createEntrepreneurDto);
    console.log('Received data in Users:', createEntrepreneurDto);
    return lastValueFrom(
      this.client.send({ cmd: 'create_entrepreneur' }, createEntrepreneurDto),
    );
  }
  
  @Get('entrepreneurs')
  async getAllEntrepreneurs() {
    return lastValueFrom(this.client.send({ cmd: 'get_all_entrepreneurs' }, {}));
  }
  
  @Get('entrepreneurs/:id')
  async getEntrepreneurById(@Param('id') id: string) {
    return lastValueFrom(
      this.client.send({ cmd: 'get_entrepreneur_by_id' }, id),
    );
  }
  
  @Get('entrepreneurs/state/:estado')
  async getEntrepreneursByState(@Param('estado') estado: 'PENDING' | 'APPROVED' | 'REJECTED') {
    return lastValueFrom(
      this.client.send({ cmd: 'get_entrepreneurs_by_state' }, estado),
    );
  }
  
  @Patch('entrepreneurs/:id')
  async updateEntrepreneur(
    @Param('id') id: string,
    @Body() updateEntrepreneurDto: UpdateEntrepreneurDTO,
  ) {
    if (updateEntrepreneurDto.comision !== undefined) {
      console.log(
        `Updating commission for Entrepreneur ID ${id} with value ${updateEntrepreneurDto.comision}`,
      );
    }
  
    return lastValueFrom(
      this.client.send(
        { cmd: 'update_entrepreneur' },
        { id, updateData: updateEntrepreneurDto },
      ),
    );
  }
  
  @Patch('entrepreneurs/:id/commission')
  async updateEntrepreneurCommission(
    @Param('id') id: string,
    @Body('comision') comision: number,
  ) {
    console.log(`Updating commission for Entrepreneur ID ${id} to ${comision}`);
    return lastValueFrom(
      this.client.send(
        { cmd: 'update_entrepreneur_commission' },
        { id, comision },
      ),
    );
  }
  
  @Delete('entrepreneurs/:id')
  async deleteEntrepreneurById(@Param('id') id: string) {
    try {
      const result = await lastValueFrom(
        this.client.send({ cmd: 'delete_entrepreneur_by_id' }, id),
      );
      return result || { message: 'Emprendedor eliminado exitosamente' };
    } catch (error) {
      if (error instanceof EmptyError) {
        throw new HttpException(
          'No se recibió respuesta del microservicio.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(
        'Error interno del servidor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  @Patch('entrepreneurs/:id/status')
  async updateEntrepreneurStatus(
    @Param('id') id: string,
    @Body('estado') estado: 'PENDING' | 'APPROVED' | 'REJECTED',
  ) {
    return lastValueFrom(
      this.client.send({ cmd: 'update_entrepreneur_status' }, { id, estado }),
    );
  }
  
  @Post('create-pet-owner')
  createPetOwner(@Body() createPetOwnerDto: CreatePetOwnerDto) {
    return this.client.send('create_pet_owner', createPetOwnerDto);
  }

  @Get('pet-owner/:id')
  findPetOwnerById(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('find_pet_owner_by_id', id);
  }

  @Post('pet-owner-by-email')
  findPetOwnerByEmail(@Body() email: string) {
    console.log('Request received in API Gateway for pet owner email:', email);
    return this.client.send('find_pet_owner_by_email', email);
  }

  @Delete('delete-pet-owner/:id')
  deletePetOwner(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('delete_pet_owner', id);
  }

  @Patch('update-pet-owner/:id')
  updatePetOwner(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updatePetOwnerDto: UpdatePetOwnerDto
  ) {
    return this.client.send(id, updatePetOwnerDto);
  }

  @Post('admin-by-email')
  findAdminByEmail(@Body() email: string) {
    return this.client.send('find_admin_by_email', email);
  }

  @Patch('entrepreneurs/:id/status-and-commission')
  async updateEntrepreneurStatusAndCommission(
    @Param('id') id: string,
    @Body() body: { estado: 'PENDING' | 'APPROVED' | 'REJECTED'; comision?: number },
  ) {
    const { estado, comision } = body;
  
    if (estado === 'APPROVED' && comision === undefined) {
      throw new HttpException(
        'La comisión es requerida para el estado APPROVED.',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    if (comision !== undefined && (comision < 0 || comision > 100)) {
      throw new HttpException(
        'La comisión debe estar entre 0 y 100.',
        HttpStatus.BAD_REQUEST,
      );
    }
  
    return lastValueFrom(
      this.client.send(
        { cmd: 'update_entrepreneur_status_and_commission' },
        { id, estado, comision },
      ),
    );
  }

  @Post('find-entrepreneur-by-email')
  async findEntrepreneurByEmail(@Body() data: { email: string }) {
    console.log('Request received in API Gateway for entrepreneur email:', data?.email);

    if (!data?.email) {
      throw new Error('Email is required');
    }

    return lastValueFrom(
      this.client.send('find_entrepreneur_by_email', { email: data.email }),
    );
  }
}
