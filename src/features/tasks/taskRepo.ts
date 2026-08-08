import { nanoid } from 'nanoid';
import { db, type Task } from '../../db/db';
import { todayISODate, nowISO, addDaysISO } from '../../shared/lib/date';
import { pointsForTaskSize } from '../gamification/pointsEngine';
import { isTaskDoneToday } from './recurrence';
import { requestNotificationPermission } from '../notifications/notificationApi';
import type { NewTaskInput } from './types';

export async function addTask(input: NewTaskInput): Promise<Task> {
  const task: Task = {
    id: nanoid(),
    title: input.title.trim(),
    notes: input.notes?.trim() || undefined,
    size: input.size,
    category: input.category?.trim() || undefined,
    recurring: input.recurring,
    weekdays: input.recurring && input.weekdays?.length ? input.weekdays : undefined,
    dueTime: input.dueTime || undefined,
    dueDate: input.recurring ? undefined : input.dueDate,
    completed: false,
    streakCount: 0,
    points: pointsForTaskSize(input.size),
    createdAt: nowISO(),
    archived: false,
  };
  await db.tasks.add(task);
  return task;
}

export async function updateTask(taskId: string, changes: Partial<NewTaskInput>) {
  const updates: Partial<Task> = { ...changes };
  if (changes.size) updates.points = pointsForTaskSize(changes.size);
  if (changes.weekdays) updates.weekdays = changes.weekdays.length ? changes.weekdays : undefined;
  await db.tasks.update(taskId, updates);
}

export async function archiveTask(taskId: string) {
  await db.tasks.update(taskId, { archived: true });
}

export async function deleteTask(taskId: string) {
  await db.transaction('rw', db.tasks, db.pointsTransactions, async () => {
    await db.tasks.delete(taskId);
    const related = await db.pointsTransactions.filter((tx) => tx.relatedTaskId === taskId).toArray();
    await db.pointsTransactions.bulkDelete(related.map((tx) => tx.id));
  });
}

export async function completeTask(taskId: string) {
  const task = await db.tasks.get(taskId);
  if (!task) return;
  const todayISO = todayISODate();
  if (isTaskDoneToday(task, todayISO)) return;

  const yesterday = addDaysISO(todayISO, -1);
  const continuingStreak = task.lastCompletedDate === yesterday;
  const newStreak = continuingStreak ? (task.streakCount ?? 0) + 1 : 1;

  await db.transaction('rw', db.tasks, db.pointsTransactions, async () => {
    await db.tasks.update(taskId, {
      completed: true,
      completedAt: nowISO(),
      lastCompletedDate: todayISO,
      streakCount: newStreak,
    });
    await db.pointsTransactions.add({
      id: nanoid(),
      amount: task.points,
      reason: `Tarea: ${task.title}`,
      relatedTaskId: task.id,
      createdAt: nowISO(),
    });
  });

  // Ask for notification permission after the first real win, not on cold
  // load — silently no-ops on iOS (unsupported) or if already decided.
  requestNotificationPermission();
}

export async function uncompleteTask(taskId: string) {
  const task = await db.tasks.get(taskId);
  if (!task) return;
  const todayISO = todayISODate();
  if (!isTaskDoneToday(task, todayISO)) return;

  await db.transaction('rw', db.tasks, db.pointsTransactions, async () => {
    await db.tasks.update(taskId, {
      completed: false,
      lastCompletedDate: undefined,
      streakCount: Math.max(0, (task.streakCount ?? 1) - 1),
    });

    const related = await db.pointsTransactions
      .filter((tx) => tx.relatedTaskId === taskId)
      .toArray();
    const mostRecent = related.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
    if (mostRecent) await db.pointsTransactions.delete(mostRecent.id);
  });
}
