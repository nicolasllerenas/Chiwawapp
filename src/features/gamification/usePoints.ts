import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { sumPoints } from './rewardsRepo';

export function usePointsBalance(): number {
  const txs = useLiveQuery(() => db.pointsTransactions.toArray(), []) ?? [];
  return sumPoints(txs);
}
