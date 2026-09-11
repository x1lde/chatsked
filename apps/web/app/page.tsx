'use client';
import { useState } from 'react';
import Link from "next/link";

const demoBookings = [
    { time: "9:00 AM", name: "Maria Santos", service: "Gel Manicure", status: "Confirmed" },
    { time: "10:30 AM", name: "Juan Dela Cruz", service: "Haircut", status: "Confirmed" },
    { time: "1:00 PM", name: "Ana Reyes", service: "Nail Art", status: "Pending" },
    ];

    export default function LandingPage() {
        const [menuOpen, setMenuOpen] = useState(false);
        return (
        <div className="min-h-screen overflow-x-hidden">
        <header className="sticky top-0 z-50 px-4 py-3 sm:px-8">
            <div className="glass-strong mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-5 py-3">
            <Link href="/" className="text-lg font-bold tracking-tight">ChatSked</Link>
            <div className="hidden items-center gap-3 sm:flex">
                <Link href="/login" className="text-sm font-medium text-charcoal/70 hover:text-charcoal">Log in</Link>
                <Link href="/signup" className="rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-white hover:bg-terracotta-dark">Get Started</Link>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden text-2xl">
                {menuOpen ? '✕' : '☰'}
            </button>
            </div>
            {menuOpen && (
            <div className="glass-strong mx-auto mt-2 max-w-6xl rounded-2xl p-4 sm:hidden">
                <Link href="/login" className="block py-2 text-center font-medium">Log in</Link>
                <Link href="/signup" className="mt-2 block rounded-full bg-terracotta py-2 text-center font-semibold text-white">Get Started</Link>
            </div>
            )}
        </header>

        <section className="px-4 pb-16 pt-10 sm:px-8 sm:pt-16">
            <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
                <span className="glass mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium text-charcoal/70">
                🇵🇭 Built for Philippine local businesses
                </span>
                <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Bookings, without the back-and-forth.
                </h1>
                <p className="mt-5 max-w-md text-lg text-charcoal/70">
                ChatSked helps small businesses manage bookings, customers, and schedules — without leaving the phone behind.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link href="/signup" className="rounded-full bg-terracotta px-6 py-3 font-semibold text-white shadow-lg shadow-terracotta/20 transition hover:bg-terracotta-dark">
                    Get Started
                </Link>
                <a href="#features" className="text-sm font-semibold text-charcoal/70 hover:text-charcoal">
                    See how it works →
                </a>
                </div>
            </div>

            <div className="relative mx-auto w-full max-w-xs">
                <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-terracotta/10 blur-2xl" />
                <div className="glass-strong rounded-[2.5rem] p-3 shadow-2xl">
                <div className="rounded-4xl] bg-cream p-4">
                    <div className="mb-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-charcoal/50">Today, Sept 11</p>
                        <p className="font-semibold">Ana&apos;s Nail Studio</p>
                    </div>
                    <div className="glass flex h-9 w-9 items-center justify-center rounded-full text-sm">A</div>
                    </div>
                    <div className="mb-4 grid grid-cols-3 gap-2 text-center">
                    <div className="glass rounded-xl py-2">
                        <p className="text-lg font-bold">12</p>
                        <p className="text-[10px] text-charcoal/50">Today</p>
                    </div>
                    <div className="glass rounded-xl py-2">
                        <p className="text-lg font-bold">3</p>
                        <p className="text-[10px] text-charcoal/50">Pending</p>
                    </div>
                    <div className="glass rounded-xl py-2">
                        <p className="text-lg font-bold">₱4.2k</p>
                        <p className="text-[10px] text-charcoal/50">Revenue</p>
                    </div>
                    </div>
                    <div className="space-y-2">
                    {demoBookings.map((b) => (
                        <div key={b.time} className="glass flex items-center justify-between rounded-xl px-3 py-2 text-sm">
                        <div>
                            <p className="font-medium">{b.name}</p>
                            <p className="text-xs text-charcoal/50">{b.time} · {b.service}</p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${b.status === "Confirmed" ? "bg-sage/20 text-sage" : "bg-amber/20 text-amber"}`}>
                            {b.status}
                        </span>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        <section className="px-4 pb-16 sm:px-8">
            <div className="mx-auto max-w-6xl text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-charcoal/40">Built for local businesses</p>
            <div className="glass mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-x-8 gap-y-3 rounded-2xl px-6 py-5 text-sm font-medium text-charcoal/70">
                <span>Salon</span><span>Clinic</span><span>Barbershop</span><span>Repair Shop</span><span>Freelancers</span><span>Tutors</span>
            </div>
            </div>
        </section>

        <section id="features" className="px-4 pb-24 sm:px-8">
            <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-center text-3xl font-bold tracking-tight sm:text-4xl">
                Everything your booking notebook wishes it could do
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="glass rounded-3xl p-6 sm:col-span-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-terracotta">Smart Booking</p>
                <h3 className="mb-2 text-xl font-bold">Stop scrolling through Messenger to find tomorrow&apos;s appointment.</h3>
                <p className="text-charcoal/60">Every booking lands in one place, automatically — whether it came from Messenger, SMS, or a walk-in.</p>
                </div>
                <div className="glass rounded-3xl p-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-sage">Customer Records</p>
                <div className="glass-strong mt-3 rounded-2xl p-4">
                    <p className="font-semibold">Maria Santos</p>
                    <p className="text-sm text-charcoal/60">5 bookings · ₱2,500 total</p>
                    <p className="text-xs text-charcoal/40">Last visit: Aug 28</p>
                </div>
                </div>
                <div className="glass rounded-3xl p-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber">Business Overview</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                    <div className="glass-strong rounded-xl py-3">
                    <p className="text-xl font-bold">12</p>
                    <p className="text-xs text-charcoal/50">Today&apos;s bookings</p>
                    </div>
                    <div className="glass-strong rounded-xl py-3">
                    <p className="text-xl font-bold">₱4,250</p>
                    <p className="text-xs text-charcoal/50">Revenue</p>
                    </div>
                </div>
                </div>
                <div className="glass rounded-3xl p-6 sm:col-span-2">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-terracotta">Booking Inbox</p>
                <h3 className="mb-3 text-xl font-bold">A Messenger conversation, turned into a booking.</h3>
                <div className="glass-strong space-y-2 rounded-2xl p-4 text-sm">
                    <p className="inline-block w-fit rounded-2xl rounded-bl-sm bg-white/70 px-3 py-2">Pwede po magpa-book bukas?</p>
                    <p className="block w-fit rounded-2xl rounded-br-sm bg-terracotta/90 px-3 py-2 text-white ml-auto">Sure po! Here&apos;s our booking link 👇</p>
                </div>
                </div>
            </div>
            </div>
        </section>

        <section className="px-4 pb-24 sm:px-8">
            <div className="glass-strong mx-auto max-w-4xl rounded-3xl p-10 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Ready to leave the notebook behind?</h2>
            <p className="mt-3 text-charcoal/60">Set up your business in minutes — no credit card, no training required.</p>
            <Link href="/signup" className="mt-6 inline-block rounded-full bg-terracotta px-8 py-3 font-semibold text-white shadow-lg shadow-terracotta/20 transition hover:bg-terracotta-dark">
                Get Started
            </Link>
            </div>
        </section>

        <footer className="px-4 pb-8 sm:px-8">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-3 text-sm text-charcoal/50 sm:flex-row sm:justify-between">
            <span>© {new Date().getFullYear()} ChatSked · Made for Philippine local businesses</span>
            <div className="flex gap-4">
            <Link href="/login" className="hover:text-charcoal">Log in</Link>
            <Link href="/signup" className="hover:text-charcoal">Sign up</Link>
            <a href="#features" className="hover:text-charcoal">Features</a>
            </div>
        </div>
        </footer>
        </div>
    );
}