'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

type Business = { id: string; name: string; location: string | null };
type Service = { id: string; name: string; durationMin: number; price: string };
type Staff = { id: string; name: string };
type Slot = { start: string; end: string };

export default function PublicBookingPage() {
    const params = useParams();
    const slug = params.businessSlug as string;

    const [business, setBusiness] = useState<Business | null>(null);
    const [services, setServices] = useState<Service[]>([]);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
    const [date, setDate] = useState('');
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState('');

    // Load business + services + staff on page load
    useEffect(() => {
        async function load() {
        try {
            const biz = await fetch(`${API_URL}/public/businesses/${slug}`).then((r) => r.json());
            setBusiness(biz);
            const svcs = await fetch(`${API_URL}/public/services?businessId=${biz.id}`).then((r) => r.json());
            setServices(svcs);
            const stf = await fetch(`${API_URL}/public/staff?businessId=${biz.id}`).then((r) => r.json());
            setStaff(stf);
        } catch {
            setError('Could not load this business. Check the link and try again.');
        }
        }
        load();
    }, [slug]);

    // Load available slots once service + staff + date are all picked
    useEffect(() => {
        if (!selectedService || !selectedStaff || !date) return;
        async function loadSlots() {
        const url = `${API_URL}/public/availability?serviceId=${selectedService!.id}&staffId=${selectedStaff!.id}&date=${date}`;
        const data = await fetch(url).then((r) => r.json());
        setSlots(data);
        }
        loadSlots();
    }, [selectedService, selectedStaff, date]);

    async function handleBook(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!business || !selectedService || !selectedStaff || !selectedSlot) return;
        try {
        const res = await fetch(`${API_URL}/public/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            businessId: business.id,
            serviceId: selectedService.id,
            staffId: selectedStaff.id,
            startsAt: selectedSlot.start,
            customerName,
            customerPhone,
            }),
        });
        if (!res.ok) throw new Error('Booking failed');
        setConfirmed(true);
        } catch {
        setError('Could not complete the booking. Please try again.');
        }
    }

    if (error) return <p className="p-6 text-red-600">{error}</p>;
    if (!business) return <p className="p-6 text-charcoal/50">Loading...</p>;

    if (confirmed) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-cream p-6">
        <div className="glass-strong w-full max-w-sm rounded-3xl p-8 text-center">
            <div className="glass mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl">✓</div>
            <h1 className="text-xl font-bold text-sage">You&apos;re booked!</h1>
            <p className="mt-2 text-charcoal/60">
            {selectedService?.name} with {selectedStaff?.name} at{' '}
            {selectedSlot && new Date(selectedSlot.start).toLocaleString()}.
            </p>
        </div>
        </div>
    );
    }

    return (
    <div className="min-h-screen bg-cream px-4 py-8">
        <div className="mx-auto max-w-sm space-y-6">
        <div className="glass-strong rounded-3xl p-5 text-center">
            <h1 className="text-xl font-bold">{business.name}</h1>
            {business.location && <p className="text-sm text-charcoal/50">{business.location}</p>}
        </div>

        <div className="glass rounded-3xl p-5">
            <p className="mb-3 text-sm font-semibold text-charcoal/70">1. Choose a service</p>
            <div className="space-y-2">
            {services.map((s) => (
                <button
                key={s.id}
                onClick={() => setSelectedService(s)}
                className={`w-full rounded-2xl border p-3 text-left transition ${
                    selectedService?.id === s.id ? 'border-terracotta bg-terracotta/5' : 'border-transparent bg-white/50'
                }`}
                >
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-charcoal/50">{s.durationMin} min · ₱{s.price}</p>
                </button>
            ))}
            </div>
        </div>

        {selectedService && (
            <div className="glass rounded-3xl p-5">
            <p className="mb-3 text-sm font-semibold text-charcoal/70">2. Choose a staff member</p>
            <div className="space-y-2">
                {staff.map((st) => (
                <button
                    key={st.id}
                    onClick={() => setSelectedStaff(st)}
                    className={`w-full rounded-2xl border p-3 text-left transition ${
                    selectedStaff?.id === st.id ? 'border-terracotta bg-terracotta/5' : 'border-transparent bg-white/50'
                    }`}
                >
                    {st.name}
                </button>
                ))}
            </div>
            </div>
        )}

        {selectedStaff && (
            <div className="glass rounded-3xl p-5">
            <p className="mb-3 text-sm font-semibold text-charcoal/70">3. Choose a date</p>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-transparent bg-white/50 px-3 py-2 outline-none"
            />
            </div>
        )}

        {date && slots.length > 0 && (
            <div className="glass rounded-3xl p-5">
            <p className="mb-3 text-sm font-semibold text-charcoal/70">4. Choose a time</p>
            <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                <button
                    key={slot.start}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-xl border p-2 text-sm transition ${
                    selectedSlot?.start === slot.start ? 'border-terracotta bg-terracotta text-white' : 'border-transparent bg-white/50'
                    }`}
                >
                    {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
                ))}
            </div>
            </div>
        )}
        {date && slots.length === 0 && (
            <p className="text-center text-sm text-charcoal/50">No open slots on this date.</p>
        )}

        {selectedSlot && (
            <form onSubmit={handleBook} className="glass-strong space-y-3 rounded-3xl p-5">
            <p className="mb-1 text-sm font-semibold text-charcoal/70">5. Your details</p>
            <input
                type="text"
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded-xl border border-transparent bg-white/60 px-3 py-2 outline-none"
                required
            />
            <input
                type="tel"
                placeholder="09XX XXX XXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-xl border border-transparent bg-white/60 px-3 py-2 outline-none"
                required
            />
            <button type="submit" className="w-full rounded-xl bg-terracotta py-3 font-semibold text-white hover:bg-terracotta-dark">
                Confirm booking
            </button>
            </form>
        )}
        </div>
    </div>
    );
}