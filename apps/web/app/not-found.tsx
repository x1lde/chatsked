import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
        <div className="glass-strong rounded-3xl p-10">
            <p className="text-5xl font-bold text-terracotta">404</p>
            <h1 className="mt-3 text-xl font-bold">Page not found</h1>
            <p className="mt-2 text-charcoal/60">This page doesn&apos;t exist — but your bookings do.</p>
            <Link href="/" className="mt-6 inline-block rounded-full bg-terracotta px-6 py-2.5 font-semibold text-white hover:bg-terracotta-dark">
            Back home
            </Link>
        </div>
        </div>
    );
}