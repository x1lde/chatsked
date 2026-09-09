import { Injectable } from '@nestjs/common';

@Injectable()
export class MessengerService {
    private readonly graphUrl = 'https://graph.facebook.com/v20.0/me/messages';

    async sendText(recipientPsid: string, text: string) {
        const pageAccessToken = process.env.MESSENGER_PAGE_ACCESS_TOKEN;
        const res = await fetch(`${this.graphUrl}?access_token=${pageAccessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            recipient: { id: recipientPsid },
            message: { text },
        }),
        });
        if (!res.ok) throw new Error(`Messenger send failed: ${await res.text()}`);
        return res.json();
    }

    async handleIncoming(body: any) {
        for (const entry of body.entry ?? []) {
        for (const event of entry.messaging ?? []) {
            const psid = event.sender?.id;
            if (psid) {
            await this.sendText(psid, "Hi! Book an appointment here: https://your-booking-link.example.com");
            }
        }
        }
    }
}