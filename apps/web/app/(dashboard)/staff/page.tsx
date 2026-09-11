'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { Spinner } from '../../../components/Spinner';

type Staff = {
    id: string;
    name: string;
};

export default function StaffPage() {
    const { showToast } = useToast();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [businessId, setBusinessId] = useState('');
    const [name, setName] = useState('');
    const [needsBusiness, setNeedsBusiness] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    async function loadStaff(biz: string) {
        const data = await apiFetch(`/staff?businessId=${biz}`);
        setStaff(data);
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
            await loadStaff(biz);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load staff';
            showToast(message, 'error');
        }
        }
        load();
    }, [showToast]);

    async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true);
        try {
        await apiFetch('/staff', {
            method: 'POST',
            body: JSON.stringify({ businessId, name }),
        });
        setName('');
        showToast('Staff member added!');
        await loadStaff(businessId);
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create staff member';
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
        <h1 className="text-2xl font-bold tracking-tight">Staff</h1>

        <form onSubmit={handleCreate} className="glass space-y-3 rounded-2xl p-5">
            <input
            type="text"
            placeholder="Staff name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass w-full rounded-xl px-3 py-2 outline-none"
            required
            />
            <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-2 font-semibold text-white hover:bg-terracotta-dark disabled:opacity-60"
            >
            {submitting ? <Spinner size={16} /> : 'Add staff member'}
            </button>
        </form>

        <ul className="space-y-2">
            {staff.map((s) => (
            <li key={s.id} className="glass flex items-center gap-3 rounded-2xl p-4">
                <div className="glass-strong flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
                {s.name.charAt(0)}
                </div>
                <p className="font-medium">{s.name}</p>
            </li>
            ))}
        </ul>
        </div>
    );
}