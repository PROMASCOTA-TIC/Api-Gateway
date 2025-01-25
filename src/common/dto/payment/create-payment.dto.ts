import { Type } from "class-transformer";
import { IsDateString, IsIn, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreatePaymentDto {

    @IsString()
    orderId: string;

    @IsString()
    paymentMethod: string;

    @IsNumber({
        maxDecimalPlaces: 2
    })
    @Min(0)
    @Type(() => Number)
    amount: number;

    @IsOptional()
    @IsString()
    @IsIn(['P', 'R', 'A'])
    status: string;

    @IsDateString()
    paymentDate: Date;
}
