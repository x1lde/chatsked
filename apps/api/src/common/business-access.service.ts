import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';    
import { DEFAULT_BUSINESS_TIMEZONE } from './business-time.js';

/**
 * Central place for tenant-ownership checks.
 *
 * JWT auth only proves "this person has a valid token" — it says nothing
 * about which business that person is allowed to touch. Every endpoint that
 * reads or writes business-scoped data (bookings, services, staff,
 * customers) must call one of these before hitting Prisma, or a valid
 * owner of Business A can read/edit/delete Business B's data just by
 * changing an id in the request.
 */
@Injectable()
export class BusinessAccessService {
    constructor(private prisma: PrismaService) {}

    async assertOwnsBusiness(ownerId: string, businessId: string): Promise<void> {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: { ownerId: true },
        });
        if (!business) throw new NotFoundException('Business not found');
        if (business.ownerId !== ownerId) {
            throw new ForbiddenException('You do not have access to this business');
        }
    }

    /** Looks up a customer's businessId and verifies the owner controls it. Returns the businessId. */
    async assertOwnsCustomer(ownerId: string, customerId: string): Promise<string> {
        const customer = await this.prisma.customer.findUnique({
            where: { id: customerId },
            select: { businessId: true },
        });
        if (!customer) throw new NotFoundException('Customer not found');
        await this.assertOwnsBusiness(ownerId, customer.businessId);
        return customer.businessId;
    }

    /** Looks up a service's businessId and verifies the owner controls it. Returns the businessId. */
    async assertOwnsService(ownerId: string, serviceId: string): Promise<string> {
        const service = await this.prisma.service.findUnique({
            where: { id: serviceId },
            select: { businessId: true },
        });
        if (!service) throw new NotFoundException('Service not found');
        await this.assertOwnsBusiness(ownerId, service.businessId);
        return service.businessId;
    }

    /** Looks up a staff member's businessId and verifies the owner controls it. Returns the businessId. */
    async assertOwnsStaff(ownerId: string, staffId: string): Promise<string> {
        const staff = await this.prisma.staff.findUnique({
            where: { id: staffId },
            select: { businessId: true },
        });
        if (!staff) throw new NotFoundException('Staff not found');
        await this.assertOwnsBusiness(ownerId, staff.businessId);
        return staff.businessId;
    }

    /** Looks up a booking's businessId and verifies the owner controls it. Returns the businessId. */
    async assertOwnsBooking(ownerId: string, bookingId: string): Promise<string> {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            select: { businessId: true },
        });
        if (!booking) throw new NotFoundException('Booking not found');
        await this.assertOwnsBusiness(ownerId, booking.businessId);
        return booking.businessId;
    }

        async getBusinessTimezone(businessId: string): Promise<string> {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
            select: { timezone: true },
        });
        if (!business) throw new NotFoundException('Business not found');
        return business.timezone ?? DEFAULT_BUSINESS_TIMEZONE;
    }

    /**
     * Anti-IDOR check for booking creation/availability: serviceId/staffId are
     * always client-supplied, and owning `businessId` says nothing about which
     * business *they* belong to. Scopes both lookups by businessId directly so
     * a mismatch surfaces as "not found" like a nonexistent id would.
     */
    async assertServiceAndStaffBelongToBusiness(
        businessId: string,
        serviceId: string,
        staffId: string,
    ): Promise<{ service: { id: string; durationMin: number; price: unknown }; staffId: string }> {
        const [service, staff] = await Promise.all([
            this.prisma.service.findFirst({
                where: { id: serviceId, businessId },
                select: { id: true, durationMin: true, price: true },
            }),
            this.prisma.staff.findFirst({
                where: { id: staffId, businessId },
                select: { id: true },
            }),
        ]);
        if (!service) throw new NotFoundException('Service not found for this business');
        if (!staff) throw new NotFoundException('Staff member not found for this business');
        return { service, staffId: staff.id };
    }

    assertBusinessIdProvided(businessId: unknown): asserts businessId is string {
        if (typeof businessId !== 'string' || businessId.length === 0) {
            throw new BadRequestException('businessId is required');
        }
    }
}
