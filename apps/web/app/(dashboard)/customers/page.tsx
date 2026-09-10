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
        <h1 className="text-xl font-semibold">Customers</h1>
        {customers.length === 0 && <p className="text-gray-500">No customers yet — they appear once someone books.</p>}
        <ul className="space-y-2">
            {customers.map((c) => (
            <li key={c.id} className="rounded border p-3">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-gray-500">
                {c.phone} {c.noShowCount > 0 && `— ${c.noShowCount} no-show(s)`}
                </p>
            </li>
            ))}
        </ul>
        </div>
    );
}