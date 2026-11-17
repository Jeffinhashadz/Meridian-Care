/**
 * Lightweight toast bus — providers push ephemeral messages for demos.
 */
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastItem {
  id: string;
  message: string;
  tone?: 'default' | 'success' | 'danger';
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastItem['tone']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, tone: ToastItem['tone'] = 'default') => {
    const id = Math.random().toString(36).slice(2);
    setItems((prev) => [...prev, { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={cn(
                'pointer-events-auto flex items-start justify-between gap-3 rounded-btn border px-4 py-3 text-sm shadow-soft',
                item.tone === 'success' && 'border-[#0A6847]/20 bg-[#DDF3EA] text-[#0A6847]',
                item.tone === 'danger' && 'border-[#A12A18]/20 bg-[#FBE0DA] text-[#A12A18]',
                item.tone === 'default' && 'border-line bg-white text-ink',
              )}
              role="status"
            >
              <span>{item.message}</span>
              <button
                type="button"
                aria-label="Dismiss"
                className="shrink-0 opacity-70 hover:opacity-100"
                onClick={() => setItems((prev) => prev.filter((t) => t.id !== item.id))}
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
