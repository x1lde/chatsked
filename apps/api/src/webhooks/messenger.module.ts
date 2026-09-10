import { Module } from '@nestjs/common';
import { MessengerWebhookController } from './messenger.controller.js';
import { MessengerService } from './messenger.service.js';

@Module({
    controllers: [MessengerWebhookController],
    providers: [MessengerService],
    exports: [MessengerService],
})
export class MessengerModule {}