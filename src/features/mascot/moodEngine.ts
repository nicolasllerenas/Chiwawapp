export type MascotMood = 'feliz' | 'neutral' | 'preocupado' | 'triste';

export interface MoodInput {
  tasksDueToday: number;
  tasksCompletedToday: number;
  currentStreak: number;
  hourOfDay: number; // 0-23
}

/**
 * Mood is always derived, never stored — avoids a second source of truth
 * that could drift from the actual task/streak data. Tuned to never read
 * as judgmental: "triste" means the mascot missed her, not that she failed.
 */
export function computeMood({ tasksDueToday, tasksCompletedToday, currentStreak, hourOfDay }: MoodInput): MascotMood {
  if (tasksCompletedToday > 0) return 'feliz';
  if (currentStreak > 0 && hourOfDay < 18) return 'neutral';
  if (hourOfDay < 12) return 'neutral';
  if (tasksDueToday === 0) return 'neutral';
  if (hourOfDay >= 21) return 'triste';
  if (hourOfDay >= 17) return 'preocupado';
  return 'neutral';
}
