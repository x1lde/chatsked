import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateStaffDto {
    @IsString()
    businessId: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsOptional()
    workingHours?: unknown;
}