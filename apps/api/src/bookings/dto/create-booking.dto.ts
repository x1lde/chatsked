import {
    IsString, IsPhoneNumber, MinLength, MaxLength, IsISO8601, IsOptional,
    Matches, registerDecorator, ValidationOptions,
} from 'class-validator';
import { Transform } from 'class-transformer';

const ID_RE = /^c[a-z0-9]{20,32}$/; // matches Prisma's cuid() format
const MAX_ADVANCE_DAYS = 90;

function IsBookableStartDate(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isBookableStartDate',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown) {
                    if (typeof value !== 'string') return false;
                    const time = new Date(value).getTime();
                    if (Number.isNaN(time)) return false;
                    const now = Date.now();
                    return time > now && time <= now + MAX_ADVANCE_DAYS * 24 * 60 * 60 * 1000;
                },
                defaultMessage() {
                    return `startsAt must be in the future and within ${MAX_ADVANCE_DAYS} days`;
                },
            },
        });
    };
}

export class CreatePublicBookingDto {
    @IsString()
    @Matches(ID_RE, { message: 'businessId is not a valid id' })
    businessId: string;

    @IsString()
    @Matches(ID_RE, { message: 'serviceId is not a valid id' })
    serviceId: string;

    @IsString()
    @Matches(ID_RE, { message: 'staffId is not a valid id' })
    staffId: string;

    @IsISO8601()
    @IsBookableStartDate()
    startsAt: string;

    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
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