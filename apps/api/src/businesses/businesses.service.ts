import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BusinessesService {
    constructor(private prisma: PrismaService) {}

    private slugify(name: string): string {
        return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    async create(ownerId: string, data: { name: string; location?: string }) {
        const baseSlug = this.slugify(data.name);
        let slug = baseSlug;
        let counter = 1;

        while (await this.prisma.business.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
        }

        return this.prisma.business.create({ data: { ownerId, slug, ...data } });
    }

    findAllForOwner(ownerId: string) {
        return this.prisma.business.findMany({ where: { ownerId } });
    }

    findBySlug(slug: string) {
        return this.prisma.business.findUniqueOrThrow({ where: { slug } });
    }
}