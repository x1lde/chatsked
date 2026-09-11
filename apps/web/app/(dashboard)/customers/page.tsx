'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { PageLoader } from '../../../components/PageLoader';

type Customer = {
    id: string;
    name: string;
    phone: string;
    noShowCount: number;
};

type Booking = {
    id: string;
    startsAt: string;
    status: string;
    service: { name: string; price: string };
    staff: { name: string };
};

type CustomerDetail = Customer & { bookings: Booking[] };

export default function CustomersPage() {
    const { showToast } = useToast();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [detail, setDetail] = useState<CustomerDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [needsBusiness, setNeedsBusiness] = useState(false);

    useEffect(() => {
        async function load() {
        try {
            const businesses = await apiFetch('/businesses');
            if (businesses.length === 0) {
            setNeedsBusiness(true);
            setLoading(false);
            return;
            }
            const data = await apiFetch(`/customers?businessId=${businesses[0].id}`);
            setCustomers(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load customers';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
        }
        load();
    }, [showToast]);

    async function selectCustomer(id: string) {
        setSelectedId(id);
        setLoadingDetail(true);
        try {
        const data = await apiFetch(`/customers/${id}`);
        setDetail(data);
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load customer details';
        showToast(message, 'error');
        } finally {
        setLoadingDetail(false);
        }
    }

    if (loading) return <PageLoader />;
    if (needsBusiness) return <p className="text-charcoal/60">Create a business first from the dashboard home page.</p>;

    const completedBookings = detail?.bookings.filter((b) => b.status === 'COMPLETED') ?? [];
    const totalSpent = completedBookings.reduce((sum, b) => sum + Number(b.service.price), 0);
    const lastVisit = completedBookings[0];

    const serviceBreakdown = completedBookings.reduce<Record<string, number>>((acc, b) => {
        acc[b.service.name] = (acc[b.service.name] ?? 0) + 1;
        return acc;
    }, {});

    return (
        <div className="grid max-w-4xl grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Customer list */}
        <div className="space-y-2 lg:col-span-2">
            <h1 className="mb-2 text-2xl font-bold tracking-tight">Customers</h1>
            {customers.length === 0 && <p className="text-charcoal/50">No customers yet — they appear once someone books.</p>}
            {customers.map((c) => (
            <button
                key={c.id}
                onClick={() => selectCustomer(c.id)}
                className={`glass flex w-full items-center justify-between rounded-2xl p-4 text-left transition ${
                selectedId === c.id ? 'ring-2 ring-terracotta' : ''
                }`}
            >
                <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-charcoal/50">{c.phone}</p>
                </div>
                {c.noShowCount > 0 && (
                <span className="rounded-full bg-amber/20 px-2 py-1 text-xs font-semibold text-amber">
                    {c.noShowCount} no-show{c.noShowCount > 1 ? 's' : ''}
                </span>
                )}
            </button>
            ))}
        </div>

        {/* Detail bento panel */}
        <div className="lg:col-span-3">
            {!selectedId && (
            <div className="glass flex h-full min-h-[300px] items-center justify-center rounded-3xl p-8 text-center text-charcoal/40">
                Select a customer to see their history
            </div>
            )}

            {selectedId && loadingDetail && <PageLoader />}

            {selectedId && !loadingDetail && detail && (
            <div className="space-y-4">
                <div className="glass-strong rounded-3xl p-5">
                <h2 className="text-xl font-bold">{detail.name}</h2>
                <p className="text-sm text-charcoal/50">{detail.phone}</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                <div className="glass rounded-2xl p-4 text-center">
                    <p className="text-xl font-bold">{completedBookings.length}</p>
                    <p className="text-xs text-charcoal/50">Total visits</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                    <p className="text-xl font-bold text-sage">₱{totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-charcoal/50">Total spent</p>
                </div>
                <div className="glass rounded-2xl p-4 text-center">
                    <p className={`text-xl font-bold ${detail.noShowCount > 0 ? 'text-amber' : ''}`}>{detail.noShowCount}</p>
                    <p className="text-xs text-charcoal/50">No-shows</p>
                </div>
                </div>

                {lastVisit && (
                <div className="glass rounded-2xl p-4">
                    <p className="text-xs font-semibold text-charcoal/50">Last visit</p>
                    <p className="font-medium">
                    {lastVisit.service.name} · {new Date(lastVisit.startsAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>
                )}

                {Object.keys(serviceBreakdown).length > 0 && (
                <div className="glass rounded-2xl p-4">
                    <p className="mb-2 text-xs font-semibold text-charcoal/50">Services availed</p>
                    <div className="flex flex-wrap gap-2">
                    {Object.entries(serviceBreakdown).map(([name, count]) => (
                        <span key={name} className="rounded-full bg-terracotta/10 px-3 py-1 text-sm font-medium text-terracotta">
                        {name} ×{count}
                        </span>
                    ))}
                    </div>
                </div>
                )}

                <div className="glass rounded-2xl p-4">
                <p className="mb-3 text-xs font-semibold text-charcoal/50">Booking history</p>
                {detail.bookings.length === 0 && <p className="text-sm text-charcoal/50">No bookings yet.</p>}
                <ul className="space-y-2">
                    {detail.bookings.map((b) => (
                    <li key={b.id} className="flex items-center justify-between rounded-xl bg-white/50 p-3 text-sm">
                        <div>
                        <p className="font-medium">{b.service.name}</p>
                        <p className="text-xs text-charcoal/50">
                            {new Date(b.startsAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} · {b.staff.name}
                        </p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        b.status === 'COMPLETED' ? 'bg-sage/20 text-sage' :
                        b.status === 'CONFIRMED' ? 'bg-amber/20 text-amber' :
                        b.status === 'NO_SHOW' ? 'bg-amber/20 text-amber' :
                        'bg-charcoal/10 text-charcoal/50'
                        }`}>
                        {b.status.replace('_', ' ')}
                        </span>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
            )}
        </div>
        </div>
    );
}