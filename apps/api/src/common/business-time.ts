import { BadRequestException } from '@nestjs/common';
import { DateTime } from 'luxon';

const DEFAULT_BUSINESS_TIMEZONE = 'Asia/Manila';
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function assertValidIsoDate(date: string): void {
    const parsed = ISO_DATE_RE.test(date) ? DateTime.fromISO(date, { zone: 'utc' }) : null;
    if (!parsed || !parsed.isValid || parsed.toISODate() !== date) {
        throw new BadRequestException(`Invalid date "${date}" — expected an ISO calendar date (yyyy-MM-dd).`);
    }
}

export function assertValidTimezone(timezone: string): void {
    if (!DateTime.local().setZone(timezone).isValid) {
        throw new BadRequestException(`Invalid IANA timezone "${timezone}".`);
    }
}

/** Half-open [start, end) UTC instant range for one business-local calendar day. */
export function businessDayRangeUtc(timezone: string, isoDate: string): { start: Date; end: Date } {
    assertValidIsoDate(isoDate);
    const startOfDay = DateTime.fromISO(isoDate, { zone: timezone }).startOf('day');
    if (!startOfDay.isValid) {
        throw new BadRequestException(`Invalid date "${isoDate}" for timezone "${timezone}".`);
    }
    const endOfDay = startOfDay.plus({ days: 1 });
    return { start: startOfDay.toJSDate(), end: endOfDay.toJSDate() };
}

export function businessTodayIsoDate(timezone: string): string {
    const today = DateTime.now().setZone(timezone).toISODate();
    if (!today) throw new BadRequestException(`Invalid timezone "${timezone}".`);
    return today;
}

export function businessTodayRangeUtc(timezone: string): { start: Date; end: Date } {
    return businessDayRangeUtc(timezone, businessTodayIsoDate(timezone));
}

/** Converts a business-local wall-clock time to the UTC instant it refers to. */
export function businessLocalTimeToUtc(timezone: string, isoDate: string, hhmm: string): Date {
    assertValidIsoDate(isoDate);
    const match = /^(\d{2}):(\d{2})$/.exec(hhmm);
    if (!match) throw new BadRequestException(`Invalid time "${hhmm}" — expected HH:mm.`);
    const dt = DateTime.fromISO(isoDate, { zone: timezone }).set({
        hour: Number(match[1]),
        minute: Number(match[2]),
        second: 0,
        millisecond: 0,
    });
    if (!dt.isValid) throw new BadRequestException(`Invalid date/time "${isoDate} ${hhmm}" for timezone "${timezone}".`);
    return dt.toJSDate();
}

export function formatInBusinessTz(
    instant: Date,
    timezone: string,
    format: string = "EEE, MMM d 'at' h:mm a",
): string {
    return DateTime.fromJSDate(instant, { zone: 'utc' }).setZone(timezone).toFormat(format);
}

export { DEFAULT_BUSINESS_TIMEZONE };