import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';
import { MessengerService } from '../webhooks/messenger.service.js';
import { formatInBusinessTz } from '../common/business-time.js';

@Processor('reminders')
export class RemindersProcessor extends WorkerHost {
    constructor(
        private prisma: PrismaService,
        private messenger: MessengerService,
    ) {
        super();
    }

    async process(job: Job) {
        const reminder = await this.prisma.reminder.findUniqueOrThrow({
        where: { id: job.data.reminderId },
        include: { booking: { include: { customer: true, service: true, business: true } } },
        });

        const text = this.buildMessage(reminder);
        const psid = reminder.booking.customer.messengerPsid;

        if (!psid) {
        await this.prisma.reminder.update({
            where: { id: reminder.id },
            data: { status: 'FAILED' },
        });
        console.warn(`No messengerPsid for customer ${reminder.booking.customer.id}, skipping reminder`);
        return;
        }

        try {
        await this.messenger.sendText(psid, text);
        await this.prisma.reminder.update({
            where: { id: reminder.id },
            data: { status: 'SENT', sentAt: new Date(), channel: 'MESSENGER' },
        });
        } catch (err) {
        await this.prisma.reminder.update({
            where: { id: reminder.id },
            data: { status: 'FAILED' },
        });
        throw err;
        }
    }

    private buildMessage(reminder: any) {
        const when = reminder.kind === 'H24' ? 'tomorrow' : 'in 2 hours';
        const localTime = formatInBusinessTz(reminder.booking.startsAt, reminder.booking.business.timezone);
        return `Reminder: your ${reminder.booking.service.name} appointment at ${reminder.booking.business.name} is ${when}, ${localTime}.`;
    }
}