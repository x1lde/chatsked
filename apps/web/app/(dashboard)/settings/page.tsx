'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { useToast } from '../../../lib/toast';
import { PageLoader } from '../../../components/PageLoader';

type Business = { id: string; name: string; location: string | null; timezone: string };

export default function SettingsPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [business, setBusiness] = useState<Business | null>(null);
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
        try {
            const businesses = await apiFetch('/businesses');
            const biz = businesses[0] as Business | undefined;
            if (biz) {
            setBusiness(biz);
            setName(biz.name);
            setLocation(biz.location ?? '');
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to load business';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
        }
        load();
    }, [showToast]);

    async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!business) return;
        setSaving(true);
        try {
        const updated = await apiFetch(`/businesses/${business.id}`, {
            method: 'PATCH',
            body: JSON.stringify({ name, location: location || undefined }),
        });
        setBusiness(updated);
        showToast('Settings saved!');
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to save settings';
        showToast(message, 'error');
        } finally {
        setSaving(false);
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        router.push('/login');
    }

    if (loading) return <PageLoader />;

    return (
        <div className="mx-auto max-w-sm space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

        {business && (
            <form onSubmit={handleSave} className="glass-strong space-y-3 rounded-3xl p-6">
            <p className="text-sm font-semibold text-charcoal/70">Business details</p>
            <input
                type="text"
                placeholder="Business name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass w-full rounded-xl px-3 py-2 outline-none"
                required
            />
            <input
                type="text"
                placeholder="Location (e.g. Quezon City)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="glass w-full rounded-xl px-3 py-2 outline-none"
            />
            <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-terracotta py-2 font-semibold text-white hover:bg-terracotta-dark disabled:opacity-60"
            >
                {saving ? 'Saving…' : 'Save changes'}
            </button>
            </form>
        )}

        <div className="glass-strong rounded-3xl p-6">
            <p className="mb-3 text-sm font-semibold text-charcoal/70">Account</p>
            <button
            onClick={handleLogout}
            className="w-full rounded-xl bg-charcoal/10 py-2 font-semibold text-charcoal hover:bg-charcoal/20"
            >
            Log out
            </button>
        </div>
        </div>
    );
}