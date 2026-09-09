import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CustomersService {
    constructor(private prisma: PrismaService) {}

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