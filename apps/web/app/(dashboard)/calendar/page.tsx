'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { PageLoader } from '../../../components/PageLoader';

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

function getMonthGrid(monthDate: Date) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay(); // 0 = Sunday
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startOffset);

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        days.push(d);
    }
    return days;
}

export default function CalendarPage() {
    const [allBookings, setAllBookings] = useState<Booking[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
    const [monthCursor, setMonthCursor] = useState(new Date());
    const [needsBusiness, setNeedsBusiness] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
        try {
            const businesses = await apiFetch('/businesses');
            if (businesses.length === 0) {
            setNeedsBusiness(true);
            setLoading(false);
            return;
            }
            const biz = businesses[0].id;
            const all = await apiFetch(`/bookings/all?businessId=${biz}`);
            setAllBookings(all);
        } finally {
            setLoading(false);
        }
        }
        init();
    }, []);

    if (loading) return <PageLoader />;
    if (needsBusiness) return <p className="text-charcoal/60">Create a business first from the dashboard home page.</p>;

    const bookingsByDay = (d: Date) =>
        allBookings.filter((b) => new Date(b.startsAt).toDateString() === d.toDateString());

    const dayBookings = bookingsByDay(selectedDate);

    function goToday() {
        const now = new Date();
        setSelectedDate(now);
        setMonthCursor(now);
    }

    function shiftMonth(delta: number) {
        const next = new Date(monthCursor);
        next.setMonth(next.getMonth() + delta);
        setMonthCursor(next);
    }

    function shiftWeek(delta: number) {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + delta * 7);
        setSelectedDate(next);
    }

    const week = getWeekDates(selectedDate);
    const monthDays = getMonthGrid(monthCursor);
    const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return (
        <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
            <div className="glass flex rounded-full p-1 text-xs font-semibold">
            <button
                onClick={() => setViewMode('week')}
                className={`rounded-full px-3 py-1 transition ${viewMode === 'week' ? 'bg-terracotta text-white' : 'text-charcoal/50'}`}
            >
                Week
            </button>
            <button
                onClick={() => setViewMode('month')}
                className={`rounded-full px-3 py-1 transition ${viewMode === 'month' ? 'bg-terracotta text-white' : 'text-charcoal/50'}`}
            >
                Month
            </button>
            </div>
        </div>

        {viewMode === 'week' && (
            <div className="glass rounded-2xl p-3">
            <div className="mb-2 flex items-center justify-between px-1">
                <button onClick={() => shiftWeek(-1)} className="rounded-full px-2 py-1 text-charcoal/50 hover:bg-charcoal/5">‹</button>
                <button onClick={goToday} className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta transition hover:bg-terracotta/20">Today</button>
                <button onClick={() => shiftWeek(1)} className="rounded-full px-2 py-1 text-charcoal/50 hover:bg-charcoal/5">›</button>
            </div>
            <div className="flex justify-between">
                {week.map((d) => {
                const isSelected = d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                const hasBookings = bookingsByDay(d).length > 0;
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
                    {hasBookings && (
                        <span className={`mt-0.5 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-terracotta'}`} />
                    )}
                    {isToday && !isSelected && !hasBookings && <span className="mt-0.5 h-1 w-1 rounded-full bg-charcoal/30" />}
                    </button>
                );
                })}
            </div>
            </div>
        )}

        {viewMode === 'month' && (
            <div className="glass rounded-2xl p-3">
            <div className="mb-3 flex items-center justify-between px-1">
                <button onClick={() => shiftMonth(-1)} className="rounded-full px-2 py-1 text-charcoal/50 hover:bg-charcoal/5">‹</button>
                <div className="flex items-center gap-2">
                <p className="font-semibold">{monthCursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                <button onClick={goToday} className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta transition hover:bg-terracotta/20">Today</button>
                </div>
                <button onClick={() => shiftMonth(1)} className="rounded-full px-2 py-1 text-charcoal/50 hover:bg-charcoal/5">›</button>
            </div>
            <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold text-charcoal/40">
                {weekdayLabels.map((l, i) => <div key={i}>{l}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {monthDays.map((d) => {
                const inMonth = d.getMonth() === monthCursor.getMonth();
                const isSelected = d.toDateString() === selectedDate.toDateString();
                const isToday = d.toDateString() === new Date().toDateString();
                const count = bookingsByDay(d).length;
                return (
                    <button
                    key={d.toISOString()}
                    onClick={() => setSelectedDate(d)}
                    className={`relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${
                    isSelected ? 'bg-terracotta text-white' :
                    isToday ? 'ring-2 ring-terracotta/40 font-semibold text-terracotta' :
                    inMonth ? 'text-charcoal hover:bg-charcoal/5' : 'text-charcoal/25'
                    }`}
                    >
                    {d.getDate()}
                    {count > 0 && (
                        <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-terracotta'}`} />
                    )}
                    </button>
                );
                })}
            </div>
            </div>
        )}

        <div>
            <p className="mb-3 font-semibold">
            {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            {dayBookings.length === 0 && <p className="text-charcoal/50">No appointments this day.</p>}
            <ul className="space-y-2">
            {dayBookings.map((b) => (
                <li key={b.id} className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-terracotta">
                    {new Date(b.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    b.status === 'COMPLETED' ? 'bg-sage/20 text-sage' :
                    b.status === 'CONFIRMED' ? 'bg-amber/20 text-amber' :
                    b.status === 'NO_SHOW' ? 'bg-amber/20 text-amber' :
                    'bg-charcoal/10 text-charcoal/50'
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