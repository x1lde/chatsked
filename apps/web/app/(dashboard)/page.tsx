'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';

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
        setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    }

    if (error) return <p className="text-red-600">{error}</p>;

    if (needsBusiness) {
        return (
        <form onSubmit={createBusiness} className="max-w-sm space-y-3">
            <h1 className="text-lg font-semibold">Set up your business</h1>
            <input
            type="text"
            placeholder="Business name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            />
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Create
            </button>
        </form>
        );
    }

    if (!businessId) return <p>Loading...</p>;

    return (
        <div>
        <h1 className="mb-4 text-xl font-semibold">Today&apos;s Schedule</h1>
        {bookings.length === 0 && <p className="text-gray-500">No bookings yet.</p>}
        <ul className="space-y-2">
            {bookings.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded border p-3">
                <div>
                <p className="font-medium">
                    {b.service.name} — {b.customer.name}
                </p>
                <p className="text-sm text-gray-500">
                    {new Date(b.startsAt).toLocaleTimeString()} with {b.staff.name}
                </p>
                </div>
                <div className="space-x-2">
                <button onClick={() => updateStatus(b.id, 'COMPLETED')} className="rounded bg-green-600 px-3 py-1 text-sm text-white">
                    Completed
                </button>
                <button onClick={() => updateStatus(b.id, 'NO_SHOW')} className="rounded bg-yellow-600 px-3 py-1 text-sm text-white">
                    No-show
                </button>
                <button onClick={() => updateStatus(b.id, 'CANCELLED')} className="rounded bg-red-600 px-3 py-1 text-sm text-white">
                    Cancel
                </button>
                </div>
            </li>
            ))}
        </ul>
        </div>
    );
}