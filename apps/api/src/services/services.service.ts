import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { BusinessAccessService } from '../common/business-access.service.js';

@Injectable()
export class ServicesService {
    constructor(
        private prisma: PrismaService,
        private businessAccess: BusinessAccessService,
    ) {}

    async create(ownerId: string, businessId: string, data: { name: string; durationMin: number; price: number }) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        return this.prisma.service.create({ data: { businessId, ...data } });
    }

    /** Unauthenticated — used by the public booking page, which has no owner to check. */
    findAllForBusinessPublic(businessId: string) {
        return this.prisma.service.findMany({ where: { businessId } });
    }

    async findAllForBusiness(ownerId: string, businessId: string) {
        await this.businessAccess.assertOwnsBusiness(ownerId, businessId);
        return this.findAllForBusinessPublic(businessId);
    }

    async update(ownerId: string, id: string, data: Partial<{ name: string; durationMin: number; price: number }>) {
        await this.businessAccess.assertOwnsService(ownerId, id);
        return this.prisma.service.update({ where: { id }, data });
    }

    async remove(ownerId: string, id: string) {
        await this.businessAccess.assertOwnsService(ownerId, id);
        return this.prisma.service.delete({ where: { id } });
    }
}