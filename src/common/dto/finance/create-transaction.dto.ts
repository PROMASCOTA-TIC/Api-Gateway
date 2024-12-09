import { Type } from "class-transformer";
import { IsDateString, IsIn, IsNumber, IsString, IsUUID, Min } from "class-validator";

export class CreateTransactionDto {

    @IsDateString()
    settlementDate: Date;

    @IsUUID()
    entrepreneurId: string;

    @IsString()
    @IsIn(['P', 'S'])
    state: string;

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    amount: number
}
