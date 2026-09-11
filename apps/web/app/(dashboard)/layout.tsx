'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/*fix for commit message*/
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
        router.push('/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen">
        <nav className="flex items-center gap-6 border-b p-4">
            <span className="font-semibold">ChatSked</span>
            <Link href="/" className="text-sm text-gray-600 hover:text-black">Schedule</Link>
            <Link href="/services" className="text-sm text-gray-600 hover:text-black">Services</Link>
            <Link href="/staff" className="text-sm text-gray-600 hover:text-black">Staff</Link>
            <Link href="/customers" className="text-sm text-gray-600 hover:text-black">Customers</Link>
        </nav>
        <main className="p-6">{children}</main>
        </div>
    );
}