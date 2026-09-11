'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../lib/api';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        document.title = 'Sign up — ChatSked';
    }, []);
    
    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError('');
        try {
        const data = await apiFetch('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        localStorage.setItem('token', data.accessToken);
        router.push('/dashboard');
        } catch (err) {
        const message = err instanceof Error ? err.message : 'Signup failed';
        setError(message);
        }
    }

    return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
        <form onSubmit={handleSubmit} className="glass-strong w-full max-w-sm space-y-4 rounded-3xl p-8">
        <h1 className="text-xl font-bold">Create your ChatSked account</h1>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-transparent bg-white/60 px-3 py-2 outline-none"
            required
        />
        <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-transparent bg-white/60 px-3 py-2 outline-none"
            required
        />
        <button type="submit" className="w-full rounded-xl bg-terracotta py-2.5 font-semibold text-white hover:bg-terracotta-dark">
            Sign up
        </button>
        </form>
    </div>
    );
}