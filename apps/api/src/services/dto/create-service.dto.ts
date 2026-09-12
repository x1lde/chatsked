import { IsString, IsNumber, IsPositive, MinLength, MaxLength } from 'class-validator';

export class CreateServiceDto {
    @IsString()
    businessId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsNumber()
    @IsPositive()
    durationMin: number;

    @IsNumber()
    @IsPositive()
    price: number;
}