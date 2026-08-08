import Dexie, { type EntityTable } from 'dexie';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  size: 'small' | 'big';
  category?: string;
  recurring: boolean;
  weekdays?: number[]; // 0=domingo..6=sábado; recurring + vacío/undefined = todos los días
  dueTime?: string; // "HH:mm"
  dueDate?: string; // ISO date, mainly for 'big' one-off tasks
  completed: boolean;
  completedAt?: string;
  lastCompletedDate?: string; // ISO date, for recurring rollover
  streakCount: number;
  points: number;
  createdAt: string;
  archived: boolean;
}

export interface BagCheckItem {
  id: string;
  label: string;
  emoji?: string;
  isDefault: boolean;
  checked: boolean;
  order: number;
}

export interface PointsTransaction {
  id: string;
  amount: number; // positive = earned, negative = redeemed
  reason: string;
  relatedTaskId?: string;
  relatedRewardId?: string;
  createdAt: string;
}

export type RewardCategory = 'comida' | 'salidas' | 'maquillaje' | 'ropa' | 'otro';

export interface Reward {
  id: string;
  title: string;
  category: RewardCategory;
  costPoints: number;
  approxSoles?: number;
  active: boolean;
  emoji?: string;
}

export interface Redemption {
  id: string;
  rewardId: string;
  redeemedAt: string;
  status: 'pendiente' | 'entregado';
  fulfilledAt?: string;
}

export interface FocusSession {
  id: string;
  durationMinutes: number;
  startedAt: string;
  endedAt?: string;
  completed: boolean;
  pointsAwarded?: number;
}

export type PlaylistMood = 'enfoque' | 'feliz' | 'calma';

export interface AppSettings {
  id: 'singleton';
  mascotName: string;
  userName: string;
  bagCheckReminderTime?: string;
  onboardingComplete: boolean;
  lastBackupAt?: string;
  streakGraceUsedWeek?: string; // ISO week key, e.g. "2026-W32"
  playlistOverrides?: Partial<Record<PlaylistMood, string>>;
}

const db = new Dexie('chiwawapp') as Dexie & {
  tasks: EntityTable<Task, 'id'>;
  bagCheckItems: EntityTable<BagCheckItem, 'id'>;
  pointsTransactions: EntityTable<PointsTransaction, 'id'>;
  rewards: EntityTable<Reward, 'id'>;
  redemptions: EntityTable<Redemption, 'id'>;
  focusSessions: EntityTable<FocusSession, 'id'>;
  settings: EntityTable<AppSettings, 'id'>;
};

// Boolean fields (completed, recurring, archived, active) are intentionally
// not indexed — IndexedDB boolean-key support is inconsistent on older
// Safari, and the dataset is tiny (personal, single-user), so filtering in
// JS after a full table read is simpler and safer than relying on it.
db.version(1).stores({
  tasks: 'id, dueDate',
  bagCheckItems: 'id, order',
  pointsTransactions: 'id, createdAt',
  rewards: 'id, category',
  redemptions: 'id, rewardId',
  focusSessions: 'id, startedAt',
  settings: 'id',
});

export { db };
