import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsUUID } from "class-validator";
import { CreateShoppingCartItemDto } from "./create-shopping-cart.dto";

export class UpdateShoppingCartItemDto extends PartialType(CreateShoppingCartItemDto) {

    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    // @Min(1)
    @Type(() => Number)
    quantity?: number;

}