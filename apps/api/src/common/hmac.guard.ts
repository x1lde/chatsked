import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'node:crypto';

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not set in the environment`);
    return value;
}

const MAX_SKEW_MS = 5 * 60 * 1000; // signature valid for 5 minutes — blocks replay of captured requests

function buildCanonicalString(timestamp: string, body: Record<string, unknown>): string {
    const { businessId, serviceId, staffId, startsAt, customerPhone } = body;
    return [timestamp, businessId, serviceId, staffId, startsAt, customerPhone]
        .map((v) => String(v ?? ''))
        .join(':');
}

@Injectable()
export class HmacGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const timestamp = req.headers['x-timestamp'];
        const signature = req.headers['x-signature'];

        if (typeof timestamp !== 'string' || typeof signature !== 'string') {
            throw new UnauthorizedException('Missing signature headers');
        }

        const timestampMs = Number(timestamp);
        if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > MAX_SKEW_MS) {
            throw new UnauthorizedException('Request signature has expired');
        }

        const secret = requireEnv('BOOKING_HMAC_SECRET');
        const canonical = buildCanonicalString(timestamp, req.body);
        const expected = createHmac('sha256', secret).update(canonical).digest('hex');

        const expectedBuf = Buffer.from(expected, 'hex');
        const providedBuf = Buffer.from(signature, 'hex');
        const valid = expectedBuf.length === providedBuf.length && timingSafeEqual(expectedBuf, providedBuf);

        if (!valid) throw new UnauthorizedException('Invalid request signature');
        return true;
    }
}