import {
  IsString,
  IsEmail,
  IsArray,
  IsOptional,
  IsEnum,
  Matches,
  MinLength,
  MaxLength,
  IsNumber,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

class HorarioDTO {
  @IsString({ message: 'El día debe ser un string válido' })
  @IsNotEmpty({ message: 'El día no puede estar vacío' })
  dia: string;

  @IsOptional()
  @IsString({ message: 'La hora de apertura debe ser un string válido' })
  horaApertura?: string;

  @IsOptional()
  @IsString({ message: 'La hora de cierre debe ser un string válido' })
  horaCierre?: string;

  @IsOptional()
  @IsEnum(['1', '0'], { message: 'Cerrado debe ser "1" (true) o "0" (false)' })
  cerrado?: '1' | '0';
}

export class CreateEntrepreneurDTO extends CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MinLength(5, { message: 'El nombre debe tener al menos 5 caracteres' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del emprendimiento no puede estar vacío' })
  nombreEmprendimiento: string;

  @IsString()
  @IsNotEmpty({ message: 'El RUC no puede estar vacío' })
  ruc: string;

  @IsString()
  @IsNotEmpty({ message: 'El número de celular no puede estar vacío' })
  numeroCelular: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del banco no puede estar vacío' })
  bancoNombre: string;

  @IsEnum(['Ahorros', 'Corriente'], {
    message: 'El tipo de cuenta debe ser Ahorros o Corriente',
  })
  bancoTipoCuenta: 'Ahorros' | 'Corriente';

  @IsString()
  @IsNotEmpty({ message: 'El número de cuenta bancaria no puede estar vacío' })
  bancoNumeroCuenta: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre del dueño de la cuenta no puede estar vacío' })
  bancoNombreDuenoCuenta: string;

  @IsEnum(['1', '0'], { message: 'realizaEnvios debe ser "1" (true) o "0" (false)' })
  realizaEnvios: '1' | '0';

  @IsEnum(['1', '0'], { message: 'soloRetiraEnTienda debe ser "1" (true) o "0" (false)' })
  soloRetiraEnTienda: '1' | '0';

  // Nueva estructura de dirección
  @IsString()
  @IsNotEmpty({ message: 'La calle principal no puede estar vacía' })
  callePrincipal: string;

  @IsString()
  @IsNotEmpty({ message: 'La calle secundaria no puede estar vacía' })
  calleSecundaria: string;

  @IsString()
  @IsNotEmpty({ message: 'La numeración no puede estar vacía' })
  numeracion: string;

  @IsString()
  @IsNotEmpty({ message: 'La referencia no puede estar vacía' })
  referencia: string;

  @IsString()
  @IsNotEmpty({ message: 'El sector local no puede estar vacío' })
  sectorLocal: string;

  @IsArray({ message: 'El horario debe ser un arreglo de objetos' })
  @ValidateNested({ each: true })
  @Type(() => HorarioDTO)
  horario: HorarioDTO[];

  @IsArray({ message: 'fotosLocal debe ser un arreglo de strings' })
  @IsString({ each: true })
  fotosLocal?: string;

  @IsArray({ message: 'fotosLogotipo debe ser un arreglo de strings' })
  @IsString({ each: true })
  fotosLogotipo?: string;
  
  @IsEnum(['1', '0'], { message: 'aceptoTerminos debe ser "1" (true) o "0" (false)' })
  aceptoTerminos: '1' | '0';

  @IsOptional()
  @IsNumber({}, { message: 'La comisión debe ser un número válido' })
  comision?: number;
}
