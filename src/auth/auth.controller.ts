import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateEntrepreneurDTO } from 'src/common/dto/global/create-entrepreneur.dto';
import { CreatePetOwnerDto } from 'src/common/dto/global/create-pet-owner.dto';
import { LoginDto } from 'src/common/dto/global/login.dto';
import { NATS_SERVICE } from 'src/config/services';



@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) { }

  @Post('verify-token')
  verifyToken(@Body() token: string) {
    console.log('verify-token', token);
    return this.client.send('verify-token', token);
  }

  @Post('login-admin')
  loginAdmin(@Body() loginDto: LoginDto) {
    return this.client.send('login-admin', {...loginDto});
  }

  @Post('login-pet-owner')
  loginPetOwner(@Body() loginDto: LoginDto) {
    console.log('login-pet-owner', loginDto);
    return this.client.send('login-pet-owner', {...loginDto});
  }

  @Post('register-pet-owner')
  registerPetOwner(@Body() createPetOwnerDto: CreatePetOwnerDto) {
    const { ...rest} = createPetOwnerDto;
    console.log('register-pet-owner', rest);
    return this.client.send('register-pet-owner', {...createPetOwnerDto});
  }

  @Post('register-entrepreneur')
  registerEntrepreneur(@Body() createEntrepreneurDto: CreateEntrepreneurDTO) {
    return this.client.send('register-entrepreneur', createEntrepreneurDto);
  }

  @Post('login-entrepreneur')
  loginEntrepreneur(@Body() loginDto: LoginDto) {
    return this.client.send('login-entrepreneur', {...loginDto});
  }
}
