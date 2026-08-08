import { nanoid } from 'nanoid';
import { db } from '../../db/db';
import { nowISO } from '../../shared/lib/date';
import { FOCUS_SESSION_POINTS } from '../gamification/pointsEngine';

export async function startFocusSession(durationMinutes: number): Promise<string> {
  const id = nanoid();
  await db.focusSessions.add({
    id,
    durationMinutes,
    startedAt: nowISO(),
    completed: false,
  });
  return id;
}

export async function completeFocusSession(id: string) {
  await db.transaction('rw', db.focusSessions, db.pointsTransactions, async () => {
    await db.focusSessions.update(id, {
      endedAt: nowISO(),
      completed: true,
      pointsAwarded: FOCUS_SESSION_POINTS,
    });
    await db.pointsTransactions.add({
      id: nanoid(),
      amount: FOCUS_SESSION_POINTS,
      reason: 'Sesión de enfoque completada',
      createdAt: nowISO(),
    });
  });
}

export async function cancelFocusSession(id: string) {
  await db.focusSessions.update(id, { endedAt: nowISO(), completed: false });
}
