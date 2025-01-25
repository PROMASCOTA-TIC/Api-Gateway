import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, HttpException, HttpStatus, BadRequestException, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { EmptyError, lastValueFrom } from 'rxjs';
import { CreatePetOwnerDto, CreateUserDto, UpdatePetOwnerDto } from 'src/common';
import { CreateEntrepreneurDTO } from 'src/common/dto/global/create-entrepreneur.dto';
import { UpdateStatusAndCommissionDTO } from 'src/common/dto/global/update-comission-status.dto';
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

    @Get('entrepreneurs/state/:estado')
    async getEntrepreneursByState(@Param('estado') estado: string) {
        if (!estado || !['PENDING', 'APPROVED', 'REJECTED'].includes(estado.toUpperCase())) {
            throw new BadRequestException(`Estado inválido: ${estado}`);
        }

        // Utilizar `lastValueFrom` para obtener el resultado del observable
        const result = await lastValueFrom(
            this.client.send(
                { cmd: 'get_entrepreneurs_by_state' },
                estado.toUpperCase()
            )
        );

        return result;
    }

    @Patch('update-entrepreneur/:idEntrepreneur')
    async updateEntrepreneur(
        @Param('idEntrepreneur') idEntrepreneur: string,
        @Body() updateEntrepreneurDto: UpdateEntrepreneurDTO,
    ) {
        updateEntrepreneurDto.idEntrepreneur = idEntrepreneur;

        try {
            return await this.client.send('update_entrepreneur', updateEntrepreneurDto).toPromise();
        } catch (error) {
            throw new HttpException(
                error.response?.message || 'Error interno del servidor',
                error.response?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
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
    async updateStatusAndCommission(
        @Param('id') id: string,
        @Body() updateStatusAndCommissionDTO: UpdateStatusAndCommissionDTO,
    ) {
        if (!id) {
            throw new BadRequestException('El ID del emprendedor es obligatorio');
        }

        const result = await lastValueFrom(
            this.client.send(
                { cmd: 'update_entrepreneur_status_and_commission' },
                { idEntrepreneur: id, updateStatusAndCommissionDTO },
            ),
        );
        return result;
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

    @Post('create-user')
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.client.send('create_user', createUserDto);
    }
}
