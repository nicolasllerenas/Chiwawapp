import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type Reward } from '../../db/db';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Modal } from '../../shared/ui/Modal';
import { MascotAvatar } from '../mascot/components/MascotAvatar';
import { PointsBadge } from './components/PointsBadge';
import { DailyWheel } from './components/DailyWheel';
import { RewardForm, type RewardFormValues } from './components/RewardForm';
import { usePointsBalance } from './usePoints';
import {
  redeemReward,
  addReward,
  updateReward,
  deactivateReward,
  markRedemptionFulfilled,
} from './rewardsRepo';

export function RewardsScreen() {
  const balance = usePointsBalance();
  const rewards = (useLiveQuery(() => db.rewards.toArray(), []) ?? [])
    .filter((r) => r.active)
    .sort((a, b) => a.costPoints - b.costPoints);
  const redemptions = (useLiveQuery(() => db.redemptions.toArray(), []) ?? []).sort((a, b) =>
    b.redeemedAt.localeCompare(a.redeemedAt),
  );

  const [formOpen, setFormOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [celebrateTitle, setCelebrateTitle] = useState<string | null>(null);

  async function handleRedeem(reward: Reward) {
    const result = await redeemReward(reward.id);
    if (result.ok) setCelebrateTitle(reward.title);
  }

  function openNew() {
    setEditingReward(null);
    setFormOpen(true);
  }

  function openEdit(reward: Reward) {
    setEditingReward(reward);
    setFormOpen(true);
  }

  async function handleSubmit(values: RewardFormValues) {
    if (editingReward) {
      await updateReward(editingReward.id, values);
    } else {
      await addReward(values);
    }
    setFormOpen(false);
  }

  async function handleDeactivate() {
    if (editingReward) await deactivateReward(editingReward.id);
    setFormOpen(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Premios</h1>
        <Button size="sm" onClick={openNew}>
          + Nuevo
        </Button>
      </div>

      <PointsBadge size="lg" />

      <DailyWheel />

      <div className="flex flex-col gap-2">
        {rewards.map((reward) => {
          const canAfford = balance >= reward.costPoints;
          return (
            <Card key={reward.id} className="flex items-center gap-3">
              <span className="text-3xl leading-none">{reward.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-ink">{reward.title}</p>
                <p className="text-xs text-ink-faint">
                  {reward.costPoints.toLocaleString('es-PE')} pts
                  {reward.approxSoles ? ` · ref. S/${reward.approxSoles}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => openEdit(reward)}
                aria-label="Editar premio"
                className="shrink-0 rounded-full p-2 text-ink-faint active:bg-surface-soft"
              >
                ✏️
              </button>
              <Button size="sm" variant={canAfford ? 'calm' : 'secondary'} disabled={!canAfford} onClick={() => handleRedeem(reward)}>
                {canAfford ? 'Canjear' : `Faltan ${reward.costPoints - balance}`}
              </Button>
            </Card>
          );
        })}
        {rewards.length === 0 && (
          <Card className="text-center text-sm text-ink-soft">Aún no hay premios en el catálogo.</Card>
        )}
      </div>

      {redemptions.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-ink-faint">Canjes</h2>
          <div className="flex flex-col gap-2">
            {redemptions.map((r) => {
              const reward = rewards.find((rw) => rw.id === r.rewardId);
              return (
                <Card key={r.id} className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{reward?.emoji ?? '🎁'}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">{reward?.title ?? 'Premio'}</p>
                    <p className="text-xs text-ink-faint">
                      {new Date(r.redeemedAt).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  {r.status === 'pendiente' ? (
                    <Button size="sm" variant="secondary" onClick={() => markRedemptionFulfilled(r.id)}>
                      Marcar entregado
                    </Button>
                  ) : (
                    <span className="rounded-full bg-calm/20 px-3 py-1 text-xs font-bold text-calm-dark">
                      Entregado
                    </span>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <RewardForm
          initial={editingReward ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          onDeactivate={editingReward ? handleDeactivate : undefined}
        />
      </Modal>

      <Modal open={!!celebrateTitle} onClose={() => setCelebrateTitle(null)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <MascotAvatar mood="feliz" size={120} interactive />
          <p className="text-lg font-extrabold text-ink">canjeaste "{celebrateTitle}" 🎉</p>
          <p className="text-sm text-ink-soft">mándale un mensaje a Pie, que ya sabe lo que sigue 💌</p>
          <Button onClick={() => setCelebrateTitle(null)} className="w-full">
            Genial
          </Button>
        </div>
      </Modal>
    </div>
  );
}
