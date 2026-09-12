import { IsString, MinLength, MaxLength, IsOptional, IsTimeZone } from 'class-validator';

export class CreateBusinessDto {
    @IsString()
    @MinLength(1)
    @MaxLength(100)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    location?: string;

    @IsOptional()
    @IsTimeZone({ message: 'timezone must be a valid IANA timezone name, e.g. Asia/Manila' })
    timezone?: string;
}