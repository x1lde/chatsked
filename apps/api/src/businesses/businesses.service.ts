import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BusinessesService {
    constructor(private prisma: PrismaService) {}

    create(ownerId: string, data: { name: string; location?: string }) {
        return this.prisma.business.create({ data: { ownerId, ...data } });
    }

    findAllForOwner(ownerId: string) {
        return this.prisma.business.findMany({ where: { ownerId } });
    }
}