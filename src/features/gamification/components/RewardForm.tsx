import { useState } from 'react';
import { Button } from '../../../shared/ui/Button';
import type { Reward, RewardCategory } from '../../../db/db';

const CATEGORIES: { id: RewardCategory; label: string }[] = [
  { id: 'comida', label: 'Comida' },
  { id: 'salidas', label: 'Salidas' },
  { id: 'maquillaje', label: 'Maquillaje' },
  { id: 'ropa', label: 'Ropa' },
  { id: 'otro', label: 'Otro' },
];

export interface RewardFormValues {
  title: string;
  category: RewardCategory;
  costPoints: number;
  approxSoles?: number;
  emoji?: string;
}

interface RewardFormProps {
  initial?: Reward;
  onSubmit: (values: RewardFormValues) => void;
  onCancel: () => void;
  onDeactivate?: () => void;
}

export function RewardForm({ initial, onSubmit, onCancel, onDeactivate }: RewardFormProps) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState<RewardCategory>(initial?.category ?? 'comida');
  const [costPoints, setCostPoints] = useState(String(initial?.costPoints ?? 150));
  const [approxSoles, setApproxSoles] = useState(String(initial?.approxSoles ?? ''));
  const [emoji, setEmoji] = useState(initial?.emoji ?? '🎁');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cost = Number(costPoints);
    if (!title.trim() || !cost || cost <= 0) return;
    onSubmit({
      title: title.trim(),
      category,
      costPoints: cost,
      approxSoles: approxSoles ? Number(approxSoles) : undefined,
      emoji: emoji || '🎁',
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-h-[80vh] flex-col gap-4 overflow-y-auto">
      <h2 className="text-lg font-extrabold text-ink">{initial ? 'Editar premio' : 'Nuevo premio'}</h2>

      <div className="flex gap-3">
        <div className="w-20">
          <label className="mb-1 block text-sm font-bold text-ink-soft">Emoji</label>
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className="w-full rounded-2xl border border-border bg-cream px-3 py-2.5 text-center text-xl outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-bold text-ink-soft">Título</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Volt a algún lado"
            className="w-full rounded-2xl border border-border bg-cream px-4 py-2.5 text-ink outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-bold text-ink-soft">Categoría</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`rounded-full border px-3 py-1 text-sm font-bold ${category === c.id ? 'border-accent bg-accent/20 text-ink' : 'border-border text-ink-soft'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-bold text-ink-soft">Costo en puntos</label>
          <input
            type="number"
            inputMode="numeric"
            value={costPoints}
            onChange={(e) => setCostPoints(e.target.value)}
            className="w-full rounded-2xl border border-border bg-cream px-4 py-2.5 text-ink outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-sm font-bold text-ink-soft">Referencia en S/ (opcional)</label>
          <input
            type="number"
            inputMode="numeric"
            value={approxSoles}
            onChange={(e) => setApproxSoles(e.target.value)}
            className="w-full rounded-2xl border border-border bg-cream px-4 py-2.5 text-ink outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Guardar
        </Button>
      </div>
      {onDeactivate && (
        <button type="button" onClick={onDeactivate} className="text-sm font-bold text-alert">
          Quitar del catálogo
        </button>
      )}
    </form>
  );
}
