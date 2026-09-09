import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RemindersProcessor } from './reminders.processor.js';
import { RemindersService } from './reminders.service.js';
import { MessengerModule } from '../webhooks/messenger.module.js';
import { SmsModule } from '../sms/sms.module.js';

@Module({
    imports: [
        BullModule.forRoot({
        connection: { host: 'localhost', port: 6379 },
        }),
        BullModule.registerQueue({ name: 'reminders' }),
        MessengerModule,
        SmsModule,
    ],
    providers: [RemindersService, RemindersProcessor],
    exports: [RemindersService],
})
export class RemindersModule {}