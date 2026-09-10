'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

type Service = {
    id: string;
    name: string;
    durationMin: number;
    price: string;
};

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [businessId, setBusinessId] = useState('');
    const [name, setName] = useState('');
    const [durationMin, setDurationMin] = useState('30');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');

    async function loadServices(biz: string) {
        const data = await apiFetch(`/services?businessId=${biz}`);
        setServices(data);
    }

    useEffect(() => {
        async function load() {
        try {
            const businesses = await apiFetch('/businesses');
            if (businesses.length === 0) {
            setError('Create a business first from the dashboard home page.');
            return;
            }
            const biz = businesses[0].id;
            setBusinessId(biz);
            await loadServices(biz);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load services';
            setError(message);
        }
        }
        load();
    }, []);

    async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
        await apiFetch('/services', {
            method: 'POST',
            body: JSON.stringify({
            businessId,
            name,
            durationMin: Number(durationMin),
            price: Number(price),
            }),
        });
        setName('');
        setPrice('');
        await loadServices(businessId);
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create service';
        setError(message);
        }
    }

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="max-w-lg space-y-6">
        <h1 className="text-xl font-semibold">Services</h1>

        <form onSubmit={handleCreate} className="space-y-3 rounded border p-4">
            <input
            type="text"
            placeholder="Service name (e.g. Haircut)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            />
            <div className="flex gap-3">
            <input
                type="number"
                placeholder="Duration (min)"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
                className="w-1/2 rounded border px-3 py-2"
                required
            />
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-1/2 rounded border px-3 py-2"
                required
            />
            </div>
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Add service
            </button>
        </form>

        <ul className="space-y-2">
            {services.map((s) => (
            <li key={s.id} className="rounded border p-3">
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-gray-500">
                {s.durationMin} min — ₱{s.price}
                </p>
            </li>
            ))}
        </ul>
        </div>
    );
}