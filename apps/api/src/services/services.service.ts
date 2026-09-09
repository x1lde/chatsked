import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ServicesService {
    constructor(private prisma: PrismaService) {}

    create(businessId: string, data: { name: string; durationMin: number; price: number }) {
        return this.prisma.service.create({ data: { businessId, ...data } });
    }

    findAllForBusiness(businessId: string) {
        return this.prisma.service.findMany({ where: { businessId } });
    }

    update(id: string, data: Partial<{ name: string; durationMin: number; price: number }>) {
        return this.prisma.service.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.service.delete({ where: { id } });
    }
}