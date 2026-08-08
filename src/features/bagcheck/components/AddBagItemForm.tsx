import { useState } from 'react';
import { addBagItem } from '../bagRepo';

export function AddBagItemForm() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    await addBagItem(value);
    setValue('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-2xl border border-dashed border-border py-3 text-sm font-bold text-ink-faint active:bg-surface-soft"
      >
        + Agregar objeto
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => !value.trim() && setOpen(false)}
        placeholder="Ej. Cuadernos"
        className="flex-1 rounded-2xl border border-border bg-cream px-4 py-2.5 text-ink outline-none focus:border-primary"
      />
      <button type="submit" className="rounded-2xl bg-primary px-4 py-2.5 font-bold text-white">
        Añadir
      </button>
    </form>
  );
}
