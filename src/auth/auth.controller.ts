import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreatePetOwnerDto } from 'src/common/dto/global/create-pet-owner.dto';
import { LoginDto } from 'src/common/dto/global/login.dto';
import { NATS_SERVICE } from 'src/config/services';



@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.client.send('login', loginDto);
  }

  @Post('register-pet-owner')
  registerPetOwner(@Body() createPetOwnerDto: CreatePetOwnerDto) {
    return this.client.send('register-pet-owner', createPetOwnerDto);
  }

  //TODO: Implementar endopoint para registrar emprendedor (JP)
  // @Post('register-entrepreneur')
  // registerVet(@Body() createPetOwnerDto: CreatePetOwnerDto) {
  //   return this.client.send('register', {createPetOwnerDto});
  // }
}
