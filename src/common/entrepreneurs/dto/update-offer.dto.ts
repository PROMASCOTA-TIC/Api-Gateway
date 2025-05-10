import { IsDateString, IsNumber, Min, IsOptional, IsUUID } from 'class-validator';

export class UpdateOfferDto {
  
  @IsUUID('4', { message: 'El ID del emprendedor debe ser un UUID válido.' })
  @IsOptional()
  entrepreneurId: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida (formato ISO 8601).' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida (formato ISO 8601).' })
  endDate?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El porcentaje de descuento debe ser un número válido.' })
  @Min(0, { message: 'El porcentaje de descuento no puede ser negativo.' })
  discountPercentage?: number;
}
