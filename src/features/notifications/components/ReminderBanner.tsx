import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReminders } from '../reminderEngine';

export function ReminderBanner() {
  const reminders = useReminders();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = reminders.filter((r) => !dismissed.has(r.id));
  const current = visible[0];

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="mb-3 flex items-center gap-3 rounded-2xl bg-blush/40 px-4 py-3"
        >
          <span className="text-xl">🐾</span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-extrabold text-ink">{current.title}</p>
            <p className="text-xs text-ink-soft">{current.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={() => setDismissed((prev) => new Set(prev).add(current.id))}
            aria-label="Descartar recordatorio"
            className="shrink-0 rounded-full p-1 text-ink-faint"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
