import { Injectable } from '@nestjs/common';
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
}