'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        try {
        const data = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        localStorage.setItem('token', data.accessToken);
        router.push('/dashboard');
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed — check your details.';
        setError(message);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
            <h1 className="text-xl font-semibold">Log in to ChatSked</h1>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2"
            required
            />
            <button type="submit" className="w-full rounded bg-black py-2 text-white">
            Log in
            </button>
        </form>
        </div>
    );
}