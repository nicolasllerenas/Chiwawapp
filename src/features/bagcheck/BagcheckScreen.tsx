import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { Card } from '../../shared/ui/Card';
import { Checkbox } from '../../shared/ui/Checkbox';
import { ProgressRing } from '../../shared/ui/ProgressRing';
import { Modal } from '../../shared/ui/Modal';
import { Button } from '../../shared/ui/Button';
import { MascotAvatar } from '../mascot/components/MascotAvatar';
import { bagcheckCompleteMessage } from '../mascot/messages';
import { useMascot } from '../mascot/useMascot';
import { AddBagItemForm } from './components/AddBagItemForm';
import { toggleBagItem, deleteBagItem, resetBagChecklist } from './bagRepo';

export function BagcheckScreen() {
  const items = useLiveQuery(() => db.bagCheckItems.orderBy('order').toArray(), []) ?? [];
  const { mascotName, userName } = useMascot();
  const [celebrate, setCelebrate] = useState(false);
  const [message, setMessage] = useState('');
  const [wasComplete, setWasComplete] = useState(false);

  const total = items.length;
  const checkedCount = items.filter((i) => i.checked).length;
  const allChecked = total > 0 && checkedCount === total;

  useEffect(() => {
    if (allChecked && !wasComplete) {
      setMessage(bagcheckCompleteMessage(userName));
      setCelebrate(true);
      setWasComplete(true);
    } else if (!allChecked && wasComplete) {
      setWasComplete(false);
    }
  }, [allChecked, wasComplete, userName]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Modo Salida 🎒</h1>
        <Button size="sm" variant="secondary" onClick={() => resetBagChecklist()}>
          Reiniciar
        </Button>
      </div>

      <Card className="flex items-center gap-4 bg-surface-soft">
        <ProgressRing progress={total ? checkedCount / total : 0} color="var(--color-calm)">
          <span className="text-sm font-extrabold text-ink">
            {checkedCount}/{total}
          </span>
        </ProgressRing>
        <p className="text-sm text-ink-soft">
          Marca cada cosa antes de salir. Cuando termines, te lo confirmo yo 🐶
        </p>
      </Card>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <Checkbox
                checked={item.checked}
                onChange={(checked) => toggleBagItem(item.id, checked)}
                label={item.label}
                emoji={item.emoji}
              />
            </div>
            {!item.isDefault && (
              <button
                type="button"
                onClick={() => deleteBagItem(item.id)}
                aria-label="Quitar objeto"
                className="shrink-0 rounded-full p-2 text-ink-faint active:bg-surface-soft"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <AddBagItemForm />

      <Modal open={celebrate} onClose={() => setCelebrate(false)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <MascotAvatar mood="feliz" size={120} interactive />
          <p className="text-lg font-extrabold text-ink">{message}</p>
          <Button onClick={() => setCelebrate(false)} className="w-full">
            ¡Gracias, {mascotName}!
          </Button>
        </div>
      </Modal>
    </div>
  );
}
