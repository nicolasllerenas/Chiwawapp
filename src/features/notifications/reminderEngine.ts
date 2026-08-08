import { useEffect, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { todayISODate, currentWeekday, hhmmToMinutes, minutesSinceMidnight } from '../../shared/lib/date';
import { isTaskDoneToday, isTaskScheduledToday } from '../tasks/recurrence';
import { showLocalNotification, hasNotificationPermission } from './notificationApi';

export interface Reminder {
  id: string;
  title: string;
  subtitle: string;
}

/**
 * Primary reminder mechanism: re-evaluated every time the app is open/in the
 * foreground (interval + visibility change), not a real push. This is the
 * one thing guaranteed to work on iOS and Android alike.
 */
export function useReminders(): Reminder[] {
  const [, setNowTick] = useState(0);
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const interval = setInterval(() => setNowTick((n) => n + 1), 30_000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') setNowTick((n) => n + 1);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const bagItems = useLiveQuery(() => db.bagCheckItems.toArray(), []) ?? [];
  const settings = useLiveQuery(() => db.settings.get('singleton'), []);

  const todayISO = todayISODate();
  const weekday = currentWeekday();
  const nowMin = minutesSinceMidnight();
  const reminders: Reminder[] = [];

  for (const task of tasks) {
    if (task.archived || !task.dueTime) continue;
    if (!isTaskScheduledToday(task, weekday, todayISO)) continue;
    if (isTaskDoneToday(task, todayISO)) continue;
    if (nowMin < hhmmToMinutes(task.dueTime)) continue;
    reminders.push({ id: `task-${task.id}-${todayISO}`, title: task.title, subtitle: 'Tarea pendiente' });
  }

  if (settings?.bagCheckReminderTime && bagItems.length > 0) {
    const allChecked = bagItems.every((i) => i.checked);
    if (!allChecked && nowMin >= hhmmToMinutes(settings.bagCheckReminderTime)) {
      reminders.push({
        id: `bagcheck-${todayISO}`,
        title: 'Revisa tu bolso antes de salir',
        subtitle: '¿Ya tienes tus llaves? 🔑',
      });
    }
  }

  useEffect(() => {
    if (!hasNotificationPermission()) return;
    for (const r of reminders) {
      if (!notifiedRef.current.has(r.id)) {
        notifiedRef.current.add(r.id);
        showLocalNotification(r.title, r.subtitle);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders.map((r) => r.id).join(',')]);

  return reminders;
}
