'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';

type Staff = {
    id: string;
    name: string;
};

export default function StaffPage() {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [businessId, setBusinessId] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    async function loadStaff(biz: string) {
        const data = await apiFetch(`/staff?businessId=${biz}`);
        setStaff(data);
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
            await loadStaff(biz);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load staff';
            setError(message);
        }
        }
        load();
    }, []);

    async function handleCreate(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
        await apiFetch('/staff', {
            method: 'POST',
            body: JSON.stringify({ businessId, name }),
        });
        setName('');
        await loadStaff(businessId);
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create staff member';
        setError(message);
        }
    }

    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="max-w-lg space-y-6">
        <h1 className="text-xl font-semibold">Staff</h1>

        <form onSubmit={handleCreate} className="space-y-3 rounded border p-4">
            <input
            type="text"
            placeholder="Staff name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            />
            <button type="submit" className="rounded bg-black px-4 py-2 text-white">
            Add staff member
            </button>
        </form>

        <ul className="space-y-2">
            {staff.map((s) => (
            <li key={s.id} className="rounded border p-3">
                {s.name}
            </li>
            ))}
        </ul>
        </div>
    );
}