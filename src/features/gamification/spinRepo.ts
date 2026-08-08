import { nanoid } from 'nanoid';
import { db } from '../../db/db';
import { nowISO, todayISODate } from '../../shared/lib/date';
import { WHEEL_SEGMENTS, pickWinningSegment, canSpinToday } from './wheelEngine';

export interface SpinResult {
  segmentIndex: number;
  points: number;
}

export async function spinWheel(): Promise<SpinResult | null> {
  const settings = await db.settings.get('singleton');
  const todayISO = todayISODate();
  if (!settings || !canSpinToday(settings.lastWheelSpinDate, todayISO)) return null;

  const segmentIndex = pickWinningSegment();
  const points = WHEEL_SEGMENTS[segmentIndex].points;

  await db.transaction('rw', db.settings, db.pointsTransactions, async () => {
    await db.settings.update('singleton', { lastWheelSpinDate: todayISO });
    await db.pointsTransactions.add({
      id: nanoid(),
      amount: points,
      reason: 'Ruleta diaria',
      createdAt: nowISO(),
    });
  });

  return { segmentIndex, points };
}
