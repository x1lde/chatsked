import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) {}

    async findOneWithHistory(id: string) {
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

    findAllForBusiness(businessId: string) {
        return this.prisma.customer.findMany({ where: { businessId } });
    }

    update(id: string, data: Partial<{ name: string; phone: string }>) {
        return this.prisma.customer.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.customer.delete({ where: { id } });
    }
}