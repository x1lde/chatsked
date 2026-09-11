'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

type Booking = {
    id: string;
    startsAt: string;
    status: string;
    service: { name: string };
    staff: { name: string };
    customer: { name: string };
};

function getWeekDates(center: Date) {
    const days = [];
    for (let i = -2; i <= 4; i++) {
        const d = new Date(center);
        d.setDate(center.getDate() + i);
        days.push(d);
    }
    return days;
    }

export default function CalendarPage() {
    const [businessId, setBusinessId] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        document.title = 'Calendar — ChatSked';
    }, []);

    useEffect(() => {
        async function init() {
        try {
            const businesses = await apiFetch('/businesses');
            if (businesses.length === 0) {
            setError('Create a business first from the dashboard home page.');
            return;
            }
            setBusinessId(businesses[0].id);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load';
            setError(message);
        }
        }
        init();
    }, []);

    useEffect(() => {
        if (!businessId) return;
        async function load() {
        const all = await apiFetch(`/bookings?businessId=${businessId}`);
        const dayStr = selectedDate.toDateString();
        setBookings(all.filter((b: Booking) => new Date(b.startsAt).toDateString() === dayStr));
        }
        load();
    }, [businessId, selectedDate]);

    if (error) return <p className="text-red-600">{error}</p>;

    const week = getWeekDates(selectedDate);

    return (
        <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>

        <div className="glass flex justify-between rounded-2xl p-3">
            {week.map((d) => {
            const isSelected = d.toDateString() === selectedDate.toDateString();
            const isToday = d.toDateString() === new Date().toDateString();
            return (
                <button
                key={d.toISOString()}
                onClick={() => setSelectedDate(d)}
                className={`flex flex-1 flex-col items-center rounded-xl py-2 text-sm transition ${
                    isSelected ? 'bg-terracotta text-white' : 'text-charcoal/60 hover:bg-charcoal/5'
                }`}
                >
                <span className="text-[10px] uppercase">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <span className="font-semibold">{d.getDate()}</span>
                {isToday && !isSelected && <span className="mt-0.5 h-1 w-1 rounded-full bg-terracotta" />}
                </button>
            );
            })}
        </div>

        <div>
            <p className="mb-3 font-semibold">
            {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            {bookings.length === 0 && <p className="text-charcoal/50">No appointments this day.</p>}
            <ul className="space-y-2">
            {bookings.map((b) => (
                <li key={b.id} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-terracotta">
                    {new Date(b.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    b.status === 'CONFIRMED' ? 'bg-sage/20 text-sage' : 'bg-amber/20 text-amber'
                    }`}>
                    {b.status}
                    </span>
                </div>
                <p className="mt-1 font-medium">{b.customer.name}</p>
                <p className="text-sm text-charcoal/50">{b.service.name} · {b.staff.name}</p>
                </li>
            ))}
            </ul>
        </div>
        </div>
    );
}