import type { Task } from '../../db/db';

export const SMALL_TASK_POINTS = 10;
export const BIG_TASK_POINTS = 40;
export const FOCUS_SESSION_POINTS = 15;

export function pointsForTaskSize(size: Task['size']): number {
  return size === 'big' ? BIG_TASK_POINTS : SMALL_TASK_POINTS;
}
