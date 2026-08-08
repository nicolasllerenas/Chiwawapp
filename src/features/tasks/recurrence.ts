import type { Task } from '../../db/db';

export const WEEKDAY_LABELS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'] as const;
export const WEEKDAY_FULL_LABELS = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
] as const;

/**
 * A recurring task with no `weekdays` (or an empty list) repeats every day —
 * that's the default so existing "todos los días" tasks keep working
 * unchanged. Setting specific weekdays lets a task mirror a real routine
 * (e.g. lab de bioingeniería solo lunes/miércoles, gym martes/jueves/sábado)
 * instead of forcing everything into a daily-or-nothing shape.
 */
export function isTaskScheduledOn(task: Task, weekday: number): boolean {
  if (!task.recurring) return false;
  if (!task.weekdays || task.weekdays.length === 0) return true;
  return task.weekdays.includes(weekday);
}

export function isTaskScheduledToday(task: Task, todayWeekday: number, todayISO: string): boolean {
  if (task.recurring) return isTaskScheduledOn(task, todayWeekday);
  return task.dueDate === todayISO;
}

/**
 * Recurring tasks never persist a "completed" flag across days — whether
 * they're done today is always derived from lastCompletedDate. This avoids
 * needing a daily rollover job (no backend/cron available) and a second
 * source of truth that could drift.
 */
export function isTaskDoneToday(task: Task, todayISO: string): boolean {
  if (task.recurring) return task.lastCompletedDate === todayISO;
  return task.completed;
}
