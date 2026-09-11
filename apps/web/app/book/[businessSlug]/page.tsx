'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { PageLoader } from '../../../components/PageLoader';
import { Spinner } from '../../../components/Spinner';
import { MiniCalendar } from '../../../components/MiniCalendar';

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
    const [selectedDay, setSelectedDay] = useState<Date | null>(null);
    const [monthCursor, setMonthCursor] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [confirmed, setConfirmed] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [loadingSlots, setLoadingSlots] = useState(false);

    const staffStepRef = useRef<HTMLDivElement>(null);
    const dateStepRef = useRef<HTMLDivElement>(null);
    const timeStepRef = useRef<HTMLDivElement>(null);
    const detailsStepRef = useRef<HTMLDivElement>(null);

    function scrollTo(ref: React.RefObject<HTMLDivElement | null>) {
        setTimeout(() => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }

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

    useEffect(() => {
        if (!selectedService || !selectedStaff || !selectedDay) return;
        async function loadSlots() {
        setLoadingSlots(true);
        try {
            const dateStr = selectedDay!.toISOString().split('T')[0];
            const url = `${API_URL}/public/availability?serviceId=${selectedService!.id}&staffId=${selectedStaff!.id}&date=${dateStr}`;
            const data = await fetch(url).then((r) => r.json());
            setSlots(data);
        } finally {
            setLoadingSlots(false);
        }
        }
        loadSlots();
    }, [selectedService, selectedStaff, selectedDay]);

    function handleSelectService(s: Service) {
        setSelectedService(s);
        scrollTo(staffStepRef);
    }

    function handleSelectStaff(st: Staff) {
        setSelectedStaff(st);
        scrollTo(dateStepRef);
    }

    function handleSelectDay(d: Date) {
        setSelectedDay(d);
        setSelectedSlot(null);
        setShowCalendar(false);
        scrollTo(timeStepRef);
    }

    function handleSelectSlot(slot: Slot) {
        setSelectedSlot(slot);
        scrollTo(detailsStepRef);
    }

    function handlePhoneChange(value: string) {
        // digits only, capped at 11 (PH mobile format: 09XXXXXXXXX)
        const digitsOnly = value.replace(/\D/g, '').slice(0, 11);
        setCustomerPhone(digitsOnly);
    }

    async function handleBook(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!business || !selectedService || !selectedStaff || !selectedSlot) return;
        setSubmitting(true);
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
        setTimeout(() => setError(''), 4000);
        } finally {
        setSubmitting(false);
        }
    }

    if (error) return <p className="p-6 text-red-600">{error}</p>;
    if (!business) return <PageLoader />;

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

    const steps = [
        { label: 'Service', done: !!selectedService },
        { label: 'Staff', done: !!selectedStaff },
        { label: 'Date', done: !!selectedDay },
        { label: 'Time', done: !!selectedSlot },
    ];

    return (
        <div className="min-h-screen bg-cream px-4 py-8">
        <div className="mx-auto max-w-sm space-y-6">
            <div className="glass-strong rounded-3xl p-5 text-center">
            <h1 className="text-xl font-bold">{business.name}</h1>
            {business.location && <p className="text-sm text-charcoal/50">{business.location}</p>}
            </div>

            <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
            {steps.map((s, i) => (
                <div key={s.label} className="flex flex-1 flex-col items-center">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    s.done ? 'bg-sage text-white' : 'bg-charcoal/10 text-charcoal/40'
                }`}>
                    {s.done ? '✓' : i + 1}
                </div>
                <span className={`mt-1 text-[10px] font-medium ${s.done ? 'text-sage' : 'text-charcoal/40'}`}>{s.label}</span>
                </div>
            ))}
            </div>

            {/* Step 1: service */}
            <div className="glass rounded-3xl p-5">
            <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-charcoal/70">1. Choose a service</p>
                {selectedService && (
                <button onClick={() => { setSelectedService(null); setSelectedStaff(null); setSelectedDay(null); setSelectedSlot(null); }} className="text-xs font-semibold text-terracotta">
                    Change
                </button>
                )}
            </div>
            {selectedService ? (
                <div className="rounded-2xl border border-terracotta bg-terracotta/5 p-3">
                <p className="font-medium">{selectedService.name}</p>
                <p className="text-sm text-charcoal/50">{selectedService.durationMin} min · ₱{selectedService.price}</p>
                </div>
            ) : (
                <div className="space-y-2">
                {services.map((s) => (
                    <button key={s.id} onClick={() => handleSelectService(s)} className="w-full rounded-2xl border border-transparent bg-white/50 p-3 text-left transition hover:border-terracotta">
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-charcoal/50">{s.durationMin} min · ₱{s.price}</p>
                    </button>
                ))}
                </div>
            )}
            </div>

            {/* Step 2: staff */}
            {selectedService && (
            <div ref={staffStepRef} className="glass rounded-3xl p-5">
                <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-charcoal/70">2. Choose a staff member</p>
                {selectedStaff && (
                    <button onClick={() => { setSelectedStaff(null); setSelectedDay(null); setSelectedSlot(null); }} className="text-xs font-semibold text-terracotta">
                    Change
                    </button>
                )}
                </div>
                {selectedStaff ? (
                <div className="rounded-2xl border border-terracotta bg-terracotta/5 p-3 font-medium">{selectedStaff.name}</div>
                ) : (
                <div className="space-y-2">
                    {staff.map((st) => (
                    <button key={st.id} onClick={() => handleSelectStaff(st)} className="w-full rounded-2xl border border-transparent bg-white/50 p-3 text-left transition hover:border-terracotta">
                        {st.name}
                    </button>
                    ))}
                </div>
                )}
            </div>
            )}

            {/* Step 3: date — popup calendar */}
            {selectedStaff && (
            <div ref={dateStepRef} className="glass rounded-3xl p-5">
                <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-charcoal/70">3. Choose a date</p>
                {selectedDay && (
                    <button onClick={() => { setSelectedDay(null); setSelectedSlot(null); }} className="text-xs font-semibold text-terracotta">
                    Change
                    </button>
                )}
                </div>
                {selectedDay && !showCalendar ? (
                <button onClick={() => setShowCalendar(true)} className="w-full rounded-2xl border border-terracotta bg-terracotta/5 p-3 text-left font-medium">
                    {selectedDay.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </button>
                ) : (
                <>
                    <button
                    onClick={() => setShowCalendar(!showCalendar)}
                    className="mb-3 w-full rounded-xl border border-dashed border-charcoal/20 p-3 text-sm text-charcoal/50"
                    >
                    Tap to pick a date
                    </button>
                    {(showCalendar || !selectedDay) && (
                    <MiniCalendar
                        monthCursor={monthCursor}
                        setMonthCursor={setMonthCursor}
                        selectedDate={selectedDay}
                        onSelect={handleSelectDay}
                        minDate={new Date()}
                    />
                    )}
                </>
                )}
            </div>
            )}

            {/* Step 4: time */}
            {selectedDay && (
            <div ref={timeStepRef} className="glass rounded-3xl p-5">
                <p className="mb-3 text-sm font-semibold text-charcoal/70">4. Choose a time</p>
                {loadingSlots && <div className="flex justify-center py-4"><Spinner size={24} /></div>}
                {!loadingSlots && slots.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {slots.map((slot) => (
                    <button
                        key={slot.start}
                        onClick={() => handleSelectSlot(slot)}
                        className={`rounded-xl border p-2 text-sm transition ${
                        selectedSlot?.start === slot.start ? 'border-terracotta bg-terracotta text-white' : 'border-transparent bg-white/50'
                        }`}
                    >
                        {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </button>
                    ))}
                </div>
                )}
                {!loadingSlots && slots.length === 0 && (
                <p className="text-center text-sm text-charcoal/50">No open slots on this date — try another day.</p>
                )}
            </div>
            )}

            {/* Summary + contact form */}
            {selectedSlot && (
            <div ref={detailsStepRef} className="space-y-6">
                <div className="glass-strong rounded-3xl p-5">
                <p className="mb-2 text-sm font-semibold text-charcoal/70">Summary</p>
                <div className="space-y-1 text-sm">
                    <p className="flex justify-between"><span className="text-charcoal/50">Service</span><span className="font-medium">{selectedService?.name}</span></p>
                    <p className="flex justify-between"><span className="text-charcoal/50">Staff</span><span className="font-medium">{selectedStaff?.name}</span></p>
                    <p className="flex justify-between"><span className="text-charcoal/50">When</span><span className="font-medium">{new Date(selectedSlot.start).toLocaleString()}</span></p>
                    <p className="mt-1 flex justify-between border-t border-charcoal/10 pt-1"><span className="text-charcoal/50">Total</span><span className="font-bold text-terracotta">₱{selectedService?.price}</span></p>
                </div>
                </div>

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
                    inputMode="numeric"
                    placeholder="09XX XXX XXXX"
                    value={customerPhone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    minLength={11}
                    maxLength={11}
                    className="w-full rounded-xl border border-transparent bg-white/60 px-3 py-2 outline-none"
                    required
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-terracotta py-3 font-semibold text-white hover:bg-terracotta-dark disabled:opacity-60"
                >
                    {submitting ? <Spinner size={18} /> : 'Confirm booking'}
                </button>
                </form>
            </div>
            )}
        </div>
        </div>
    );
}