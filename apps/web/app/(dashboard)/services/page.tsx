'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { Spinner } from '../../../components/Spinner';

type Service = {
    id: string;
    name: string;
    durationMin: number;
    price: string;
};

export default function ServicesPage() {
    const { showToast } = useToast();
    const [services, setServices] = useState<Service[]>([]);
    const [businessId, setBusinessId] = useState('');
    const [name, setName] = useState('');
    const [durationMin, setDurationMin] = useState('30');
    const [price, setPrice] = useState('');
    const [needsBusiness, setNeedsBusiness] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function loadServices(biz: string) {
        const data = await apiFetch(`/services?businessId=${biz}`);
        setServices(data);
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
            await loadServices(biz);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load services';
            showToast(message, 'error');
        }
        }
        load();
    }, [showToast]);

    async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
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
        showToast('Service added!');
        await loadServices(businessId);
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create service';
        showToast(message, 'error');
        } finally {
        setSubmitting(false);
        }
    }

    if (needsBusiness) {
        return <p className="text-charcoal/60">Create a business first from the dashboard home page.</p>;
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">
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
            <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-2 font-semibold text-white hover:bg-terracotta-dark disabled:opacity-60"
            >
            {submitting ? <Spinner size={16} /> : 'Add service'}
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