import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class StaffService {
    constructor(private prisma: PrismaService) {}

    create(businessId: string, data: { name: string; workingHours?: string; }) {
        return this.prisma.staff.create({ data: { businessId, ...data } });
    }

    findAllForBusiness(businessId: string) {
        return this.prisma.staff.findMany({ where: { businessId } });
    }

    update(id: string, data: Partial<{ name: string; workingHours?: string }>) {
        return this.prisma.staff.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.staff.delete({ where: { id } });
    }
}
