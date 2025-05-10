import { IsDateString, IsNumber, IsUUID, Min } from "class-validator"
import { Type } from "class-transformer"

export class CreateTaxDto {
    
    @IsDateString()
    taxDate: Date;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    totalCommissions: number

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    ivaCalculated: number

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    netProfit: number
}
