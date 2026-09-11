'use client';

function getMonthGrid(monthDate: Date) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startOffset);
    const days: Date[] = [];
    for (let i = 0; i < 42; i++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        days.push(d);
    }
    return days;
}

export function MiniCalendar({
    monthCursor,
    setMonthCursor,
    selectedDate,
    onSelect,
    minDate,
    }: {
    monthCursor: Date;
    setMonthCursor: (d: Date) => void;
    selectedDate: Date | null;
    onSelect: (d: Date) => void;
    minDate?: Date;
    }) {
    const monthDays = getMonthGrid(monthCursor);
    const weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    function shiftMonth(delta: number) {
        const next = new Date(monthCursor);
        next.setMonth(next.getMonth() + delta);
        setMonthCursor(next);
    }

    return (
        <div className="glass-strong rounded-2xl p-3">
        <div className="mb-3 flex items-center justify-between px-1">
            <button type="button" onClick={() => shiftMonth(-1)} className="rounded-full px-2 py-1 text-charcoal/50 hover:bg-charcoal/5">‹</button>
            <p className="text-sm font-semibold">{monthCursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
            <button type="button" onClick={() => shiftMonth(1)} className="rounded-full px-2 py-1 text-charcoal/50 hover:bg-charcoal/5">›</button>
        </div>
        <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-semibold text-charcoal/40">
            {weekdayLabels.map((l, i) => <div key={i}>{l}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
            {monthDays.map((d) => {
            const inMonth = d.getMonth() === monthCursor.getMonth();
            const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
            const isToday = d.toDateString() === new Date().toDateString();
            const disabled = minDate ? d < new Date(minDate.toDateString()) : false;
            return (
                <button
                type="button"
                key={d.toISOString()}
                disabled={disabled}
                onClick={() => onSelect(d)}
                className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm transition ${
                disabled ? 'text-charcoal/15 cursor-not-allowed' :
                isSelected ? 'bg-terracotta text-white' :
                isToday ? 'ring-2 ring-terracotta/40 font-semibold text-terracotta' :
                inMonth ? 'text-charcoal hover:bg-charcoal/5' : 'text-charcoal/25'
                }`}
                >
                {d.getDate()}
                </button>
            );
            })}
        </div>
        </div>
    );
}