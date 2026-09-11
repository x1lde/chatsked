import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RemindersService } from '../reminders/reminders.service.js';
import { BusinessAccessService } from '../common/business-access.service.js';

@Injectable()
export class BookingsService {
    constructor(
        private prisma: PrismaService,
        private remindersService: RemindersService,
        private businessAccess: BusinessAccessService,
    ) {}

    async getAvailableSlots(serviceId: string, staffId: string, date: string) {
        const service = await this.prisma.service.findUniqueOrThrow({ where: { id: serviceId } });
        const dayStart = new Date(`${date}T00:00:00`);
        const dayEnd = new Date(`${date}T23:59:59`);

        const existingBookings = await this.prisma.booking.findMany({
        where: {
            staffId,
            startsAt: { gte: dayStart, lte: dayEnd },
            status: { not: 'CANCELLED' },
        },
        orderBy: { startsAt: 'asc' },
        });

        // TODO later: pull real hours from Staff.workingHours instead of hardcoding 9-6
        const workStart = new Date(`${date}T09:00:00`);
        const workEnd = new Date(`${date}T18:00:00`);
        const slotLengthMs = service.durationMin * 60 * 1000;

        const slots: { start: Date; end: Date }[] = [];
        let cursor = workStart;

        while (cursor.getTime() + slotLengthMs <= workEnd.getTime()) {
        const slotEnd = new Date(cursor.getTime() + slotLengthMs);
        const overlaps = existingBookings.some(
            (b) => cursor < b.endsAt && slotEnd > b.startsAt,
        );
        if (!overlaps) slots.push({ start: new Date(cursor), end: slotEnd });
        cursor = new Date(cursor.getTime() + slotLengthMs);
        }

        return slots;
    }

    async createBooking(businessId: string, dto: {
        serviceId: string;
        staffId: string;
        startsAt: string;
        customerName: string;
        customerPhone: string;
        messengerPsid?: string;
        source: 'MESSENGER' | 'SMS' | 'MANUAL';
    }, ownerId?: string) {
        // ownerId is only present for the authenticated "manual booking" path.
        // The public booking flow is intentionally unauthenticated.
        if (ownerId) {
            await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        }
        const service = await this.prisma.service.findUniqueOrThrow({ where: { id: dto.serviceId } });
        const startsAt = new Date(dto.startsAt);
        const endsAt = new Date(startsAt.getTime() + service.durationMin * 60000);

        const customer = await this.prisma.customer.upsert({
        where: { businessId_phone: { businessId, phone: dto.customerPhone } },
        update: { name: dto.customerName, ...(dto.messengerPsid && { messengerPsid: dto.messengerPsid }) },
        create: { businessId, name: dto.customerName, phone: dto.customerPhone, messengerPsid: dto.messengerPsid },
        });

        const booking = await this.prisma.booking.create({
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

        const h24 = new Date(booking.startsAt.getTime() - 24 * 60 * 60 * 1000);
        const h2 = new Date(booking.startsAt.getTime() - 2 * 60 * 60 * 1000);
        const now = Date.now();

        if (h24.getTime() > now) await this.remindersService.schedule(booking.id, 'H24', h24);
        if (h2.getTime() > now) await this.remindersService.schedule(booking.id, 'H2', h2);

        return booking;
    }

    async findTodayForBusiness(ownerId: string, businessId: string) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        const dayStart = new Date();
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date();
        dayEnd.setHours(23, 59, 59, 999);

        return this.prisma.booking.findMany({
        where: {
            businessId,
            startsAt: { gte: dayStart, lte: dayEnd },
            status: { not: 'CANCELLED' },
        },
        include: { service: true, staff: true, customer: true },
        orderBy: { startsAt: 'asc' },
        });
    }

    async findAllForBusiness(ownerId: string, businessId: string) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        return this.prisma.booking.findMany({
        where: {
            businessId,
            status: { not: 'CANCELLED' },
        },
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