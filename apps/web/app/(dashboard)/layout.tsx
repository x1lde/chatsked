'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
    { href: '/dashboard', label: 'Home', icon: '🏠' },
    { href: '/calendar', label: 'Calendar', icon: '📅' },
    { href: '/services', label: 'Services', icon: '✂️' },
    { href: '/staff', label: 'Staff', icon: '👤' },
    { href: '/customers', label: 'Customers', icon: '📇' },
];

    export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) router.push('/login');
    }, [router]);

    return (
        <div className="min-h-screen bg-cream">
        <aside className="fixed inset-y-0 left-0 hidden w-56 flex-col border-r border-charcoal/5 bg-white/60 p-5 backdrop-blur-xl lg:flex">
            <span className="mb-8 text-lg font-bold">ChatSked</span>
            <nav className="space-y-1">
            {navItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    pathname === item.href ? 'bg-terracotta text-white' : 'text-charcoal/70 hover:bg-charcoal/5'
                }`}
                >
                <span>{item.icon}</span>
                {item.label}
                </Link>
            ))}
            </nav>
        </aside>

        <div className="glass sticky top-0 z-40 flex items-center justify-between px-4 py-3 lg:hidden">
            <span className="font-bold">ChatSked</span>
        </div>

        <main className="px-4 py-6 pb-24 sm:px-6 lg:ml-56 lg:px-8 lg:pb-8">{children}</main>

        <nav className="glass-strong fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl px-2 py-2 lg:hidden">
            {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center rounded-xl px-3 py-1.5 text-xs font-medium ${
                pathname === item.href ? 'text-terracotta' : 'text-charcoal/50'
                }`}
            >
                <span className="text-lg">{item.icon}</span>
                {item.label}
            </Link>
            ))}
        </nav>
        </div>
    );
}