import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { RemindersService } from '../reminders/reminders.service.js';
import { BusinessAccessService } from '../common/business-access.service.js';
import { businessDayRangeUtc, businessLocalTimeToUtc, businessTodayRangeUtc } from '../common/business-time.js';

function isBookingOverlapViolation(err: unknown): boolean {
    const parts: string[] = [];
    if (err instanceof Error) parts.push(err.message);
    if (err && typeof err === 'object') {
        const meta = (err as { meta?: { message?: unknown; code?: unknown } }).meta;
        if (meta?.message) parts.push(String(meta.message));
        if (meta?.code) parts.push(String(meta.code));
        const code = (err as { code?: unknown }).code;
        if (code) parts.push(String(code));
    }
    const combined = parts.join(' ');
    return combined.includes('23P01') || combined.includes('booking_no_overlap') || combined.includes('exclusion constraint');
}

function isSerializationFailure(err: unknown): boolean {
    return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2034';
}

const DEFAULT_WORK_START = '09:00';
const DEFAULT_WORK_END = '18:00';

@Injectable()
export class BookingsService {
    constructor(
        private prisma: PrismaService,
        private remindersService: RemindersService,
        private businessAccess: BusinessAccessService,
    ) {}

    async getAvailableSlots(businessId: string, serviceId: string, staffId: string, date: string) {
        this.businessAccess.assertBusinessIdProvided(businessId);
        const [{ service }, timezone] = await Promise.all([
            this.businessAccess.assertServiceAndStaffBelongToBusiness(businessId, serviceId, staffId),
            this.businessAccess.getBusinessTimezone(businessId),
        ]);

        const { start: dayStart, end: dayEnd } = businessDayRangeUtc(timezone, date);

        const existingBookings = await this.prisma.booking.findMany({
            where: {
                staffId,
                startsAt: { gte: dayStart, lt: dayEnd },
                status: { not: 'CANCELLED' },
            },
            orderBy: { startsAt: 'asc' },
        });

        // TODO later: pull real hours from Staff.workingHours instead of this
        // default — keep going through businessLocalTimeToUtc when you do.
        const workStart = businessLocalTimeToUtc(timezone, date, DEFAULT_WORK_START);
        const workEnd = businessLocalTimeToUtc(timezone, date, DEFAULT_WORK_END);
        const slotLengthMs = service.durationMin * 60 * 1000;

        const slots: { start: Date; end: Date }[] = [];
        let cursor = workStart;

        while (cursor.getTime() + slotLengthMs <= workEnd.getTime()) {
            const slotEnd = new Date(cursor.getTime() + slotLengthMs);
            const overlaps = existingBookings.some((b) => cursor < b.endsAt && slotEnd > b.startsAt);
            if (!overlaps) slots.push({ start: new Date(cursor), end: slotEnd });
            cursor = new Date(cursor.getTime() + slotLengthMs);
        }

        return slots;
    }

    async createBooking(
        businessId: string,
        dto: {
            serviceId: string;
            staffId: string;
            startsAt: string;
            customerName: string;
            customerPhone: string;
            messengerPsid?: string;
            source: 'MESSENGER' | 'SMS' | 'MANUAL';
        },
        ownerId?: string,
    ) {
        this.businessAccess.assertBusinessIdProvided(businessId);

        if (ownerId) {
            await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        }

        const { service } = await this.businessAccess.assertServiceAndStaffBelongToBusiness(
            businessId,
            dto.serviceId,
            dto.staffId,
        );

        const startsAt = new Date(dto.startsAt);
        const endsAt = new Date(startsAt.getTime() + service.durationMin * 60000);

        let booking;
        try {
            booking = await this.prisma.$transaction(
                async (tx) => {
                    const conflict = await tx.booking.findFirst({
                        where: {
                            staffId: dto.staffId,
                            status: { not: 'CANCELLED' },
                            startsAt: { lt: endsAt },
                            endsAt: { gt: startsAt },
                        },
                    });
                    if (conflict) {
                        throw new ConflictException('This time slot was just booked by someone else. Please pick another.');
                    }

                    const customer = await tx.customer.upsert({
                        where: { businessId_phone: { businessId, phone: dto.customerPhone } },
                        update: { name: dto.customerName, ...(dto.messengerPsid && { messengerPsid: dto.messengerPsid }) },
                        create: { businessId, name: dto.customerName, phone: dto.customerPhone, messengerPsid: dto.messengerPsid },
                    });

                    return tx.booking.create({
                        data: {
                            businessId,
                            serviceId: dto.serviceId,
                            staffId: dto.staffId,
                            customerId: customer.id,
                            startsAt,
                            endsAt,
                            source: dto.source,
                        },
                    });
                },
                { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
            );
        } catch (err) {
            if (isSerializationFailure(err) || isBookingOverlapViolation(err)) {
                throw new ConflictException('This time slot was just booked by someone else. Please pick another.');
            }
            throw err;
        }

        const h24 = new Date(booking.startsAt.getTime() - 24 * 60 * 60 * 1000);
        const h2 = new Date(booking.startsAt.getTime() - 2 * 60 * 60 * 1000);
        const now = Date.now();

        if (h24.getTime() > now) await this.remindersService.schedule(booking.id, 'H24', h24);
        if (h2.getTime() > now) await this.remindersService.schedule(booking.id, 'H2', h2);

        return booking;
    }

    async findTodayForBusiness(ownerId: string, businessId: string) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        const timezone = await this.businessAccess.getBusinessTimezone(businessId);
        const { start: dayStart, end: dayEnd } = businessTodayRangeUtc(timezone);

        return this.prisma.booking.findMany({
            where: {
                businessId,
                startsAt: { gte: dayStart, lt: dayEnd },
                status: { not: 'CANCELLED' },
            },
            include: { service: true, staff: true, customer: true },
            orderBy: { startsAt: 'asc' },
        });
    }

    async findAllForBusiness(ownerId: string, businessId: string) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        return this.prisma.booking.findMany({
            where: { businessId, status: { not: 'CANCELLED' } },
            include: { service: true, staff: true, customer: true },
            orderBy: { startsAt: 'asc' },
        });
    }

    async updateStatus(ownerId: string, id: string, status: 'COMPLETED' | 'NO_SHOW' | 'CANCELLED') {
        await this.businessAccess.assertOwnsBooking(ownerId, id);
        return this.prisma.$transaction(async (tx) => {
            const booking = await tx.booking.update({ where: { id }, data: { status } });
            if (status === 'NO_SHOW') {
                await tx.customer.update({
                    where: { id: booking.customerId },
                    data: { noShowCount: { increment: 1 } },
                });
            }
            return booking;
        });
    }
}