import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { MessengerService } from './messenger.service.js';

@Controller('webhooks/messenger')
export class MessengerWebhookController {
    constructor(private messenger: MessengerService) {}

    @Get()
    verify(
        @Query('hub.mode') mode: string,
        @Query('hub.verify_token') token: string,
        @Query('hub.challenge') challenge: string,
        @Res() res: Response,
    ) {
        if (mode === 'subscribe' && token === process.env.MESSENGER_VERIFY_TOKEN) {
        return res.status(200).send(challenge);
        }
        return res.sendStatus(403);
    }

    @Post()
    async receive(@Body() body: any, @Res() res: Response) {
        res.sendStatus(200);
        await this.messenger.handleIncoming(body);
    }
}