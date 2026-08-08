import { nanoid } from 'nanoid';
import { db, type Reward } from '../../db/db';
import { nowISO } from '../../shared/lib/date';

export function sumPoints(transactions: { amount: number }[]): number {
  return transactions.reduce((sum, tx) => sum + tx.amount, 0);
}

export async function getPointsBalance(): Promise<number> {
  const txs = await db.pointsTransactions.toArray();
  return sumPoints(txs);
}

export async function redeemReward(rewardId: string): Promise<{ ok: boolean; reason?: 'not-found' | 'insufficient' }> {
  const reward = await db.rewards.get(rewardId);
  if (!reward) return { ok: false, reason: 'not-found' };

  const balance = await getPointsBalance();
  if (balance < reward.costPoints) return { ok: false, reason: 'insufficient' };

  await db.transaction('rw', db.pointsTransactions, db.redemptions, async () => {
    await db.pointsTransactions.add({
      id: nanoid(),
      amount: -reward.costPoints,
      reason: `Canje: ${reward.title}`,
      relatedRewardId: reward.id,
      createdAt: nowISO(),
    });
    await db.redemptions.add({
      id: nanoid(),
      rewardId: reward.id,
      redeemedAt: nowISO(),
      status: 'pendiente',
    });
  });

  return { ok: true };
}

export async function markRedemptionFulfilled(redemptionId: string) {
  await db.redemptions.update(redemptionId, { status: 'entregado', fulfilledAt: nowISO() });
}

export async function addReward(input: Omit<Reward, 'id' | 'active'>) {
  await db.rewards.add({ id: nanoid(), active: true, ...input });
}

export async function updateReward(id: string, changes: Partial<Omit<Reward, 'id'>>) {
  await db.rewards.update(id, changes);
}

export async function deactivateReward(id: string) {
  await db.rewards.update(id, { active: false });
}
