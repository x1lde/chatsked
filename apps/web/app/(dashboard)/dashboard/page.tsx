'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

type Booking = {
    id: string;
    startsAt: string;
    status: string;
    service: { name: string };
    staff: { name: string };
    customer: { name: string; phone: string };
    };

    export default function DashboardHomePage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [businessId, setBusinessId] = useState<string | null>(null);
    const [needsBusiness, setNeedsBusiness] = useState(false);
    const [businessName, setBusinessName] = useState('');
    const [error, setError] = useState('');

    async function loadBookings(biz: string) {
        const todaysBookings = await apiFetch(`/bookings?businessId=${biz}`);
        setBookings(todaysBookings);
    }

    useEffect(() => {
        async function load() {
        try {
            const businesses = await apiFetch('/businesses');
            if (businesses.length === 0) {
            setNeedsBusiness(true);
            return;
            }
            const biz = businesses[0].id;
            setBusinessId(biz);
            await loadBookings(biz);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load businesses';
            setError(message);
        }
        }
        load();
    }, []);

    async function createBusiness(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
        const biz = await apiFetch('/businesses', {
            method: 'POST',
            body: JSON.stringify({ name: businessName }),
        });
        setBusinessId(biz.id);
        setNeedsBusiness(false);
        await loadBookings(biz.id);
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create business';
        setError(message);
        }
    }

    async function updateStatus(bookingId: string, status: string) {
        await apiFetch(`/bookings/${bookingId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        setBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status } : b))
        );
    }

    if (error) return <p className="text-red-600">{error}</p>;

    if (needsBusiness) {
        return (
            <div className="glass-strong mx-auto max-w-sm rounded-3xl p-6">
            <h1 className="mb-4 text-lg font-bold">Set up your business</h1>
            <form onSubmit={createBusiness} className="space-y-3">
                <input
                type="text"
                placeholder="Business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="glass w-full rounded-xl px-3 py-2 outline-none"
                required
                />
                <button type="submit" className="w-full rounded-xl bg-terracotta py-2 font-semibold text-white hover:bg-terracotta-dark">
                Create
                </button>
            </form>
            </div>
        );
        }

    if (!businessId) return <p>Loading...</p>;

    const completedToday = bookings.filter((b) => b.status === 'COMPLETED').length;
    const upcomingToday = bookings.filter((b) => b.status === 'CONFIRMED').length;

    return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Good day 👋</h1>

        <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{bookings.length}</p>
            <p className="text-xs text-charcoal/50">Today</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{completedToday}</p>
            <p className="text-xs text-charcoal/50">Completed</p>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{upcomingToday}</p>
            <p className="text-xs text-charcoal/50">Upcoming</p>
        </div>
        </div>

        <div>
        <h2 className="mb-3 text-lg font-semibold">Today&apos;s Schedule</h2>
        {bookings.length === 0 && <p className="text-charcoal/50">No bookings yet.</p>}
        <ul className="space-y-3">
            {bookings.map((b) => (
            <li key={b.id} className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                <p className="font-semibold">{b.service.name} — {b.customer.name}</p>
                <p className="text-sm text-charcoal/50">{new Date(b.startsAt).toLocaleTimeString()} with {b.staff.name}</p>
                </div>
                {b.status === 'CONFIRMED' ? (
                <div className="flex gap-2">
                    <button onClick={() => updateStatus(b.id, 'COMPLETED')} className="rounded-full bg-sage px-3 py-1.5 text-xs font-semibold text-white">Completed</button>
                    <button onClick={() => updateStatus(b.id, 'NO_SHOW')} className="rounded-full bg-amber px-3 py-1.5 text-xs font-semibold text-white">No-show</button>
                    <button onClick={() => updateStatus(b.id, 'CANCELLED')} className="rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-white">Cancel</button>
                </div>
                ) : (
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                    b.status === 'COMPLETED' ? 'bg-sage/20 text-sage' :
                    b.status === 'NO_SHOW' ? 'bg-amber/20 text-amber' :
                    'bg-charcoal/10 text-charcoal/50'
                }`}>
                    {b.status.replace('_', ' ')}
                </span>
                )}
            </li>
            ))}
        </ul>
        </div>
    </div>
    );
}