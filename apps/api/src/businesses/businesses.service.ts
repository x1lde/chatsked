import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { DEFAULT_BUSINESS_TIMEZONE } from '../common/business-time.js';

const OWNER_SAFE_SELECT = {
    id: true, name: true, slug: true, location: true, timezone: true,
    operatingHours: true, fbPageId: true, smsSenderId: true, createdAt: true,
} as const;

const PUBLIC_SAFE_SELECT = {
    id: true, name: true, slug: true, location: true, timezone: true, operatingHours: true,
} as const;

@Injectable()
export class BusinessesService {
    constructor(private prisma: PrismaService) {}

    private slugify(name: string): string {
        return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    async create(ownerId: string, data: { name: string; location?: string; timezone?: string }) {
        const baseSlug = this.slugify(data.name);
        let slug = baseSlug;
        let counter = 1;
        while (await this.prisma.business.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }
        return this.prisma.business.create({
            data: {
                ownerId,
                slug,
                name: data.name,
                location: data.location,
                timezone: data.timezone ?? DEFAULT_BUSINESS_TIMEZONE,
            },
            select: OWNER_SAFE_SELECT,
        });
    }

    findAllForOwner(ownerId: string) {
        return this.prisma.business.findMany({ where: { ownerId }, select: OWNER_SAFE_SELECT });
    }

    /** Public — no auth. Must never return ownerId or fbPageAccessToken. */
    findBySlug(slug: string) {
        return this.prisma.business.findUniqueOrThrow({ where: { slug }, select: PUBLIC_SAFE_SELECT });
    }

    async update(ownerId: string, businessId: string, data: { name?: string; location?: string; timezone?: string }) {
        const business = await this.prisma.business.findUnique({ where: { id: businessId }, select: { ownerId: true } });
        if (!business) throw new NotFoundException('Business not found');
        if (business.ownerId !== ownerId) throw new ForbiddenException('You do not have access to this business');

        return this.prisma.business.update({
            where: { id: businessId },
            data: {
                ...(data.name !== undefined ? { name: data.name } : {}),
                ...(data.location !== undefined ? { location: data.location } : {}),
                ...(data.timezone !== undefined ? { timezone: data.timezone } : {}),
            },
            select: OWNER_SAFE_SELECT,
        });
    }
}