import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'node:crypto';

const API_URL = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`${name} is not set in the environment`);
    return value;
}

export async function POST(req: NextRequest) {
    const booking = await req.json();

    const secret = requireEnv('BOOKING_HMAC_SECRET');
    const timestamp = String(Date.now());
    const canonical = [timestamp, booking.businessId, booking.serviceId, booking.staffId, booking.startsAt, booking.customerPhone].join(':');
    const signature = createHmac('sha256', secret).update(canonical).digest('hex');

    const apiRes = await fetch(`${API_URL}/public/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-timestamp': timestamp, 'x-signature': signature },
        body: JSON.stringify(booking),
    });

    const data = await apiRes.json().catch(() => null);
    return NextResponse.json(data, { status: apiRes.status });
}