import { Injectable } from '@nestjs/common';

@Injectable()
export class SmsService {
    async send(phone: string, message: string) {
        // Real Semaphore integration comes in Phase 8 — stub for now
        console.log(`[SMS STUB] Would send to ${phone}: ${message}`);
    }
}