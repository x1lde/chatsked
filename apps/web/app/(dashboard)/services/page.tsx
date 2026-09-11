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

    useEffect(() => {
        document.title = 'Services — ChatSked';
    }, []);

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
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>

        <form onSubmit={handleCreate} className="glass space-y-3 rounded-2xl p-5">
        <input
            type="text"
            placeholder="Service name (e.g. Gel Manicure)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass w-full rounded-xl px-3 py-2 outline-none"
            required
        />
        <div className="flex gap-3">
            <input
            type="number"
            placeholder="Duration (min)"
            value={durationMin}
            onChange={(e) => setDurationMin(e.target.value)}
            className="glass w-1/2 rounded-xl px-3 py-2 outline-none"
            required
            />
            <input
            type="number"
            placeholder="Price (₱)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="glass w-1/2 rounded-xl px-3 py-2 outline-none"
            required
            />
        </div>
        <button type="submit" className="w-full rounded-xl bg-terracotta py-2 font-semibold text-white hover:bg-terracotta-dark">
            Add service
        </button>
        </form>

        <ul className="space-y-2">
        {services.map((s) => (
            <li key={s.id} className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-charcoal/50">{s.durationMin} min</p>
            </div>
            <span className="rounded-full bg-sage/20 px-3 py-1 text-sm font-semibold text-sage">₱{s.price}</span>
            </li>
        ))}
        </ul>
    </div>
    );
}