import { IsDateString, IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateOfferDto {
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
