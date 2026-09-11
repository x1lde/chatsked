import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BusinessAccessService } from '../common/business-access.service.js';

@Injectable()
export class CustomersService {
    constructor(
        private prisma: PrismaService,
        private businessAccess: BusinessAccessService,
    ) {}

    async findOneWithHistory(ownerId: string, id: string) {
        await this.businessAccess.assertOwnsCustomer(ownerId, id);
        return this.prisma.customer.findUniqueOrThrow({
            where: { id },
            include: {
            bookings: {
                include: { service: true, staff: true },
                orderBy: { startsAt: 'desc' },
            },
            },
        });
    }

    async findAllForBusiness(ownerId: string, businessId: string) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        return this.prisma.customer.findMany({ where: { businessId } });
    }

    async update(ownerId: string, id: string, data: Partial<{ name: string; phone: string }>) {
        await this.businessAccess.assertOwnsCustomer(ownerId, id);
        return this.prisma.customer.update({ where: { id }, data });
    }

    async remove(ownerId: string, id: string) {
        await this.businessAccess.assertOwnsCustomer(ownerId, id);
        return this.prisma.customer.delete({ where: { id } });
    }
}