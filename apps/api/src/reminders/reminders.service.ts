import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class RemindersService {
    constructor(
        @InjectQueue('reminders') private queue: Queue,
        private prisma: PrismaService,
    ) {}

    async schedule(bookingId: string, kind: 'H24' | 'H2', sendAt: Date) {
        const reminder = await this.prisma.reminder.create({
        data: { bookingId, kind, channel: 'MESSENGER', status: 'PENDING' },
        });
        const delay = Math.max(0, sendAt.getTime() - Date.now());
        await this.queue.add('send-reminder', { reminderId: reminder.id }, { delay });
    }
}