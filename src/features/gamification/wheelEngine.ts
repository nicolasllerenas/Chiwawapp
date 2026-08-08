export interface WheelSegment {
  points: number;
  color: string;
}

// Average payout (~19 pts) sits between a small task (10) and a big one
// (40) — a fun daily ritual, not a way to out-earn actually doing things.
export const WHEEL_SEGMENTS: WheelSegment[] = [
  { points: 10, color: 'var(--color-primary)' },
  { points: 50, color: 'var(--color-accent)' },
  { points: 15, color: 'var(--color-calm)' },
  { points: 10, color: 'var(--color-blush)' },
  { points: 25, color: 'var(--color-primary)' },
  { points: 15, color: 'var(--color-calm)' },
  { points: 20, color: 'var(--color-accent)' },
  { points: 5, color: 'var(--color-blush)' },
];

export function pickWinningSegment(): number {
  return Math.floor(Math.random() * WHEEL_SEGMENTS.length);
}

export function canSpinToday(lastSpinDate: string | undefined, todayISO: string): boolean {
  return lastSpinDate !== todayISO;
}
