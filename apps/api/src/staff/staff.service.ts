import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BusinessAccessService } from '../common/business-access.service.js';

@Injectable()
export class StaffService {
    constructor(
        private prisma: PrismaService,
        private businessAccess: BusinessAccessService,
    ) {}

    async create(ownerId: string, businessId: string, data: { name: string; workingHours?: string; }) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        return this.prisma.staff.create({ data: { businessId, ...data } });
    }

    /** Unauthenticated — used by the public booking page, which has no owner to check. */
    findAllForBusinessPublic(businessId: string) {
        return this.prisma.staff.findMany({ where: { businessId } });
    }

    async findAllForBusiness(ownerId: string, businessId: string) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        return this.findAllForBusinessPublic(businessId);
    }

    async update(ownerId: string, id: string, data: Partial<{ name: string; workingHours?: string }>) {
        await this.businessAccess.assertOwnsStaff(ownerId, id);
        return this.prisma.staff.update({ where: { id }, data });
    }

    async remove(ownerId: string, id: string) {
        await this.businessAccess.assertOwnsStaff(ownerId, id);
        return this.prisma.staff.delete({ where: { id } });
    }
}
