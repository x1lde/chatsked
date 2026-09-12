import { IsString, IsPhoneNumber, MinLength, MaxLength, IsISO8601, IsOptional } from 'class-validator';

export class CreatePublicBookingDto {
    @IsString()
    businessId: string;

    @IsString()
    serviceId: string;

    @IsString()
    staffId: string;

    @IsISO8601()
    startsAt: string;

    @IsString()
    @MinLength(1)
    @MaxLength(100)
    customerName: string;

    @IsPhoneNumber('PH', { message: 'Please enter a valid Philippine phone number' })
    customerPhone: string;

    @IsOptional()
    @IsString()
    messengerPsid?: string;
}