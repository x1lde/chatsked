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
    if (!business) return <p className="p-6">Loading...</p>;

    if (confirmed) {
        return (
        <div className="mx-auto max-w-sm p-6 text-center">
            <h1 className="text-xl font-semibold text-green-700">You&apos;re booked!</h1>
            <p className="mt-2 text-gray-600">
            {selectedService?.name} with {selectedStaff?.name} at{' '}
            {selectedSlot && new Date(selectedSlot.start).toLocaleString()}.
            </p>
        </div>
        );
    }

    return (
        <div className="mx-auto max-w-sm space-y-6 p-6">
        <h1 className="text-xl font-semibold">{business.name}</h1>
        {business.location && <p className="text-sm text-gray-500">{business.location}</p>}

        {/* Step 1: pick a service */}
        <div>
            <p className="mb-2 font-medium">Choose a service</p>
            <div className="space-y-2">
            {services.map((s) => (
                <button
                key={s.id}
                onClick={() => setSelectedService(s)}
                className={`w-full rounded border p-3 text-left ${selectedService?.id === s.id ? 'border-black' : ''}`}
                >
                {s.name} — {s.durationMin} min — ₱{s.price}
                </button>
            ))}
            </div>
        </div>

        {/* Step 2: pick a staff member */}
        {selectedService && (
            <div>
            <p className="mb-2 font-medium">Choose a staff member</p>
            <div className="space-y-2">
                {staff.map((st) => (
                <button
                    key={st.id}
                    onClick={() => setSelectedStaff(st)}
                    className={`w-full rounded border p-3 text-left ${selectedStaff?.id === st.id ? 'border-black' : ''}`}
                >
                    {st.name}
                </button>
                ))}
            </div>
            </div>
        )}

        {/* Step 3: pick a date */}
        {selectedStaff && (
            <div>
            <p className="mb-2 font-medium">Choose a date</p>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded border px-3 py-2"
            />
            </div>
        )}

        {/* Step 4: pick a time slot */}
        {date && slots.length > 0 && (
            <div>
            <p className="mb-2 font-medium">Choose a time</p>
            <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                <button
                    key={slot.start}
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded border p-2 text-sm ${selectedSlot?.start === slot.start ? 'border-black' : ''}`}
                >
                    {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </button>
                ))}
            </div>
            </div>
        )}
        {date && slots.length === 0 && <p className="text-sm text-gray-500">No open slots on this date.</p>}

        {/* Step 5: contact details + confirm */}
        {selectedSlot && (
            <form onSubmit={handleBook} className="space-y-3 rounded border p-4">
            <input
                type="text"
                placeholder="Your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full rounded border px-3 py-2"
                required
            />
            <input
                type="tel"
                placeholder="Phone number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded border px-3 py-2"
                required
            />
            <button type="submit" className="w-full rounded bg-black py-2 text-white">
                Confirm booking
            </button>
            </form>
        )}
        </div>
    );
}