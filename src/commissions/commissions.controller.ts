import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CalculateCommissionDto } from 'src/common/dto/finance/calculate-commission.dto';
import { NATS_SERVICE } from 'src/config';

@Controller('commissions')
export class CommissionsController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy, 
  ) {}

  @Post('calculate-entrepreneur-commission')
  calculateEntrepreneurCommission(@Body() calculateCommissionDto: CalculateCommissionDto){   
    return this.client.send('calculate_entrepreneur_commission', { ...calculateCommissionDto });
  }

  @Post('calculate-pet-owner-commission')
  calculatePetOwnerCommission(@Body() calculateCommissionDto: CalculateCommissionDto){   
    return this.client.send('calculate_pet_owner_commission', { ...calculateCommissionDto });
  }
}
