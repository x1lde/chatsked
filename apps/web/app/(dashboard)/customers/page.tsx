'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

type Customer = {
    id: string;
    name: string;
    phone: string;
    noShowCount: number;
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        async function load() {
        try {
            const businesses = await apiFetch('/businesses');
            if (businesses.length === 0) {
            setError('Create a business first from the dashboard home page.');
            return;
            }
            const data = await apiFetch(`/customers?businessId=${businesses[0].id}`);
            setCustomers(data);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load customers';
            setError(message);
        }
        }
        load();
    }, []);

    if (error) return <p className="text-red-600">{error}</p>;

    return (
    <div className="max-w-lg space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        {customers.length === 0 && <p className="text-charcoal/50">No customers yet — they appear once someone books.</p>}
        <ul className="space-y-2">
        {customers.map((c) => (
            <li key={c.id} className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-sm text-charcoal/50">{c.phone}</p>
            </div>
            {c.noShowCount > 0 && (
                <span className="rounded-full bg-amber/20 px-2 py-1 text-xs font-semibold text-amber">
                {c.noShowCount} no-show{c.noShowCount > 1 ? 's' : ''}
                </span>
            )}
            </li>
        ))}
        </ul>
    </div>
    );
}