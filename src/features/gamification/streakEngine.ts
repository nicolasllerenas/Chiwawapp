import { addDaysISO } from '../../shared/lib/date';

/**
 * Streak = consecutive days with at least one point-earning action, walking
 * backward from today. Includes one grace day (a single forgiven gap) so a
 * bad day never wipes out the streak — important given her anxiety/depression,
 * this must never feel punitive.
 */
export function calculateStreak(activeDatesISO: string[], todayISO: string): number {
  const activeSet = new Set(activeDatesISO);
  let streak = 0;
  let graceRemaining = 1;
  let cursor = todayISO;

  if (activeSet.has(cursor)) {
    streak++;
  }
  cursor = addDaysISO(cursor, -1);

  while (true) {
    if (activeSet.has(cursor)) {
      streak++;
      cursor = addDaysISO(cursor, -1);
    } else if (graceRemaining > 0) {
      graceRemaining--;
      cursor = addDaysISO(cursor, -1);
    } else {
      break;
    }
  }

  return streak;
}

export function nextStreakMilestone(streak: number): number | null {
  const milestones = [3, 7, 14, 30, 60, 100, 200, 365];
  return milestones.find((m) => m > streak) ?? null;
}
