'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { PageLoader } from '../../../components/PageLoader';

type Booking = {
    id: string;
    startsAt: string;
    status: string;
    service: { name: string; price: string };
    staff: { name: string };
    customer: { name: string; phone: string };
};

type Business = { id: string; name: string };

export default function DashboardHomePage() {
    const { showToast } = useToast();
    const [business, setBusiness] = useState<Business | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
    const [needsBusiness, setNeedsBusiness] = useState(false);
    const [businessName, setBusinessName] = useState('');
    const [loading, setLoading] = useState(true);
    const [confirmingCancel, setConfirmingCancel] = useState<string | null>(null);

    async function loadAll(biz: Business) {
        const todaysBookings = await apiFetch(`/bookings?businessId=${biz.id}`);
        setBookings(todaysBookings);

        const all = await apiFetch(`/bookings/all?businessId=${biz.id}`);
        const now = Date.now();
        const future = all.filter(
        (b: Booking) => new Date(b.startsAt).getTime() > now && b.status === 'CONFIRMED'
        );
        setUpcomingBookings(future);
    }

    useEffect(() => {
        async function load() {
        try {
            const businesses = await apiFetch('/businesses');
            if (businesses.length === 0) {
            setNeedsBusiness(true);
            setLoading(false);
            return;
            }
            const biz = businesses[0];
            setBusiness(biz);
            await loadAll(biz);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load businesses';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
        }
        load();
    }, [showToast]);

    async function createBusiness(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
        const biz = await apiFetch('/businesses', {
            method: 'POST',
            body: JSON.stringify({ name: businessName }),
        });
        setBusiness(biz);
        setNeedsBusiness(false);
        showToast('Business created!');
        await loadAll(biz);
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create business';
        showToast(message, 'error');
        }
    }

    async function updateStatus(bookingId: string, status: string) {
        try {
        await apiFetch(`/bookings/${bookingId}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
        showToast(`Marked as ${status.replace('_', ' ').toLowerCase()}`);
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update booking';
        showToast(message, 'error');
        }
    }

    if (loading) return <PageLoader />;

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

    const completedToday = bookings.filter((b) => b.status === 'COMPLETED');
    const pendingToday = bookings.filter((b) => b.status === 'CONFIRMED').length;
    const revenueToday = completedToday.reduce((sum, b) => sum + Number(b.service.price), 0);

    return (
        <div className="space-y-8">
        <h1 className="text-2xl font-bold tracking-tight">Good day{business ? `, ${business.name}` : ''} 👋</h1>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{bookings.length}</p>
            <p className="text-xs text-charcoal/50">Today</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{completedToday.length}</p>
            <p className="text-xs text-charcoal/50">Completed</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold">{pendingToday}</p>
            <p className="text-xs text-charcoal/50">Pending</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
            <p className="text-2xl font-bold text-sage">₱{revenueToday.toLocaleString()}</p>
            <p className="text-xs text-charcoal/50">Revenue</p>
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
                    <button onClick={() => setConfirmingCancel(b.id)} className="rounded-full bg-terracotta px-3 py-1.5 text-xs font-semibold text-white">Cancel</button>
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

        <div>
            <h2 className="mb-3 text-lg font-semibold">Upcoming Bookings</h2>
            {upcomingBookings.length === 0 && <p className="text-charcoal/50">Nothing scheduled beyond today.</p>}
            <ul className="space-y-3">
            {upcomingBookings.map((b) => (
                <li key={b.id} className="glass flex items-center justify-between rounded-2xl p-4">
                <div>
                    <p className="font-semibold">{b.service.name} — {b.customer.name}</p>
                    <p className="text-sm text-charcoal/50">
                    {new Date(b.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at{' '}
                    {new Date(b.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with {b.staff.name}
                    </p>
                </div>
                <span className="rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold text-terracotta">
                    {new Date(b.startsAt).toLocaleDateString(undefined, { weekday: 'short' })}
                </span>
                </li>
            ))}
            </ul>
        </div>

        {confirmingCancel && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="glass-strong w-full max-w-xs rounded-3xl p-6 text-center">
                <p className="mb-4 font-semibold">Cancel this booking?</p>
                <p className="mb-5 text-sm text-charcoal/60">This can&apos;t be undone.</p>
                <div className="flex gap-3">
                <button
                    onClick={() => setConfirmingCancel(null)}
                    className="flex-1 rounded-xl bg-charcoal/10 py-2 font-semibold text-charcoal"
                >
                    Keep it
                </button>
                <button
                    onClick={() => {
                    updateStatus(confirmingCancel, 'CANCELLED');
                    setConfirmingCancel(null);
                    }}
                    className="flex-1 rounded-xl bg-terracotta py-2 font-semibold text-white"
                >
                    Yes, cancel
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    );
}