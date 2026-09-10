'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        try {
        const data = await apiFetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        localStorage.setItem('token', data.accessToken);
        router.push('/');
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed';
        setError(message);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-lg border p-6">
            <h1 className="text-xl font-semibold">Create your ChatSked account</h1>
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
            Sign up
            </button>
        </form>
        </div>
    );
}