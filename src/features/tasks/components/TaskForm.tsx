import { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import { WEEKDAY_LABELS, WEEKDAY_FULL_LABELS } from '../recurrence';
import type { NewTaskInput, Task } from '../types';

const CATEGORY_CHIPS = ['Salud', 'Estudio', 'Casa', 'Autocuidado', 'Otro'];

type Frequency = 'daily' | 'weekly' | 'once';

function initialFrequency(task?: Task): Frequency {
  if (!task?.recurring) return task ? 'once' : 'daily';
  return task.weekdays?.length ? 'weekly' : 'daily';
}

interface TaskFormProps {
  initial?: Task;
  onSubmit: (input: NewTaskInput) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function TaskForm({ initial, onSubmit, onCancel, onDelete }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [size, setSize] = useState<Task['size']>(initial?.size ?? 'small');
  const [frequency, setFrequency] = useState<Frequency>(initialFrequency(initial));
  const [weekdays, setWeekdays] = useState<number[]>(initial?.weekdays ?? []);
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [dueTime, setDueTime] = useState(initial?.dueTime ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');

  function toggleWeekday(day: number) {
    setWeekdays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    if (frequency === 'weekly' && weekdays.length === 0) return;
    onSubmit({
      title,
      size,
      recurring: frequency !== 'once',
      weekdays: frequency === 'weekly' ? weekdays : undefined,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      category: category || undefined,
      notes: notes || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto">
      <h2 className="text-lg font-extrabold text-ink">{initial ? 'Editar tarea' : 'Nueva tarea'}</h2>

      <div>
        <label className="mb-1 block text-sm font-bold text-ink-soft">¿Qué hay que hacer?</label>
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej. Cocinar almuerzo"
          className="w-full rounded-2xl border border-border bg-cream px-4 py-3 text-ink outline-none focus:border-primary"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-ink-soft">Tamaño</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setSize('small')} className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-bold ${size === 'small' ? 'border-primary bg-primary-soft text-primary-dark' : 'border-border text-ink-soft'}`}>
            Chiquita (+10 pts)
          </button>
          <button type="button" onClick={() => setSize('big')} className={`flex-1 rounded-2xl border px-3 py-2 text-sm font-bold ${size === 'big' ? 'border-primary bg-primary-soft text-primary-dark' : 'border-border text-ink-soft'}`}>
            Grande (+40 pts)
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-ink-soft">¿Con qué frecuencia?</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setFrequency('daily')} className={`flex-1 rounded-2xl border px-2 py-2 text-sm font-bold ${frequency === 'daily' ? 'border-calm bg-calm/10 text-calm-dark' : 'border-border text-ink-soft'}`}>
            Todos los días
          </button>
          <button type="button" onClick={() => setFrequency('weekly')} className={`flex-1 rounded-2xl border px-2 py-2 text-sm font-bold ${frequency === 'weekly' ? 'border-calm bg-calm/10 text-calm-dark' : 'border-border text-ink-soft'}`}>
            Ciertos días
          </button>
          <button type="button" onClick={() => setFrequency('once')} className={`flex-1 rounded-2xl border px-2 py-2 text-sm font-bold ${frequency === 'once' ? 'border-calm bg-calm/10 text-calm-dark' : 'border-border text-ink-soft'}`}>
            Una vez
          </button>
        </div>
      </div>

      {frequency === 'weekly' && (
        <div>
          <label className="mb-1 block text-sm font-bold text-ink-soft">¿Qué días? (como tu horario real)</label>
          <div className="flex gap-1.5">
            {WEEKDAY_LABELS.map((label, day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleWeekday(day)}
                title={WEEKDAY_FULL_LABELS[day]}
                className={`flex h-10 flex-1 items-center justify-center rounded-full border text-sm font-bold ${
                  weekdays.includes(day) ? 'border-primary bg-primary text-white' : 'border-border text-ink-soft'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {weekdays.length === 0 && <p className="mt-1 text-xs text-alert">Elige al menos un día.</p>}
        </div>
      )}

      {frequency === 'once' && (
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-bold text-ink-soft">Fecha</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-2xl border border-border bg-cream px-3 py-2.5 text-ink outline-none focus:border-primary" />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-bold text-ink-soft">Hora (opcional)</label>
            <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full rounded-2xl border border-border bg-cream px-3 py-2.5 text-ink outline-none focus:border-primary" />
          </div>
        </div>
      )}
      {frequency !== 'once' && (
        <div>
          <label className="mb-1 block text-sm font-bold text-ink-soft">Hora (opcional)</label>
          <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="w-full rounded-2xl border border-border bg-cream px-3 py-2.5 text-ink outline-none focus:border-primary" />
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-bold text-ink-soft">Categoría (opcional)</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setCategory(category === chip ? '' : chip)}
              className={`rounded-full border px-3 py-1 text-sm font-bold ${category === chip ? 'border-accent bg-accent/20 text-ink' : 'border-border text-ink-soft'}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-ink-soft">Notas (opcional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-2xl border border-border bg-cream px-4 py-3 text-ink outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Guardar
        </Button>
      </div>
      {onDelete && (
        <button type="button" onClick={onDelete} className="text-sm font-bold text-alert">
          Eliminar tarea
        </button>
      )}
    </form>
  );
}
