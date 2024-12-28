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

// Clase para definir la estructura de cada objeto en el campo "horario"
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

export class CreateEntrepreneurDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsEmail({}, { message: 'El correo electrónico debe tener un formato válido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @MinLength(5, { message: 'El nombre debe tener al menos 5 caracteres' })
  name: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @MaxLength(20, { message: 'La contraseña no puede exceder los 20 caracteres' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'La contraseña debe incluir al menos una letra y un número',
  })
  password: string;

  @IsEnum(['1', '0'], { message: 'isEntrepreneur debe ser "1" (true) o "0" (false)' })
  isEntrepreneur: '1' | '0';

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

  @IsString()
  @IsNotEmpty({ message: 'La dirección local no puede estar vacía' })
  direccionLocal: string;

  @IsString()
  @IsNotEmpty({ message: 'El sector local no puede estar vacío' })
  sectorLocal: string;

  @IsArray({ message: 'El horario debe ser un arreglo de objetos' })
  @ValidateNested({ each: true })
  @Type(() => HorarioDTO)
  horario: HorarioDTO[];

  @IsArray({ message: 'Las fotos del local deben ser un arreglo de strings' })
  @IsOptional()
  fotosLocal: string[];

  @IsArray({ message: 'Las fotos del logotipo deben ser un arreglo de strings' })
  @IsOptional()
  fotosLogotipo: string[];

  @IsEnum(['1', '0'], { message: 'aceptoTerminos debe ser "1" (true) o "0" (false)' })
  aceptoTerminos: '1' | '0';

  @IsOptional()
  @IsNumber({}, { message: 'La comisión debe ser un número válido' })
  comision?: number;
}
