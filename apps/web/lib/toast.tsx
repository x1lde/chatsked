'use client';

import { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error';
type Toast = { id: number; message: string; type: ToastType };

type ToastContextValue = {
    showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'success') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        }, type === 'error' ? 4000 : 2500);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
        {children}
        <div className="fixed bottom-20 left-1/2 z-100 flex -translate-x-1/2 flex-col gap-2 lg:bottom-6">
            {toasts.map((t) => (
            <div
                key={t.id}
                className={`glass-strong rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
                t.type === 'success' ? 'text-sage' : 'text-amber'
                }`}
            >
                {t.message}
            </div>
            ))}
        </div>
        </ToastContext.Provider>
    );
    }

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
}