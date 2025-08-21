'use client';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Toast = { id: number; message: string; variant?: 'success'|'error'|'info' };

export default function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const detail = (e as CustomEvent).detail as { message: string; variant?: Toast['variant'] };
      const id = Date.now() + Math.random();
      const toast: Toast = { id, message: detail.message, variant: detail.variant || 'info' };
      setToasts(prev => [...prev, toast]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    }
    window.addEventListener('toast', onToast as any);
    return () => window.removeEventListener('toast', onToast as any);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence initial={false}>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className={`rounded-lg shadow-lg ring-1 p-3 min-w-[260px] ${
              t.variant === 'success' ? 'bg-emerald-50 ring-emerald-200 text-emerald-900' :
              t.variant === 'error' ? 'bg-rose-50 ring-rose-200 text-rose-900' :
              'bg-violet-50 ring-violet-200 text-violet-900'
            }`}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}


