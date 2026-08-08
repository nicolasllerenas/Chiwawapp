import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { computeMood } from './moodEngine';
import { calculateStreak } from '../gamification/streakEngine';
import { todayISODate, currentWeekday } from '../../shared/lib/date';
import { isTaskScheduledToday } from '../tasks/recurrence';

export function useMascot() {
  const todayISO = todayISODate();
  const weekday = currentWeekday();

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const transactions = useLiveQuery(() => db.pointsTransactions.toArray(), []) ?? [];
  const settings = useLiveQuery(() => db.settings.get('singleton'), []);

  const activeTasks = tasks.filter((t) => !t.archived);
  const tasksDueTodayList = activeTasks.filter((t) => isTaskScheduledToday(t, weekday, todayISO));
  const tasksCompletedTodayList = tasksDueTodayList.filter(
    (t) => t.lastCompletedDate === todayISO,
  );

  const activeDates = Array.from(
    new Set(
      transactions
        .filter((tx) => tx.amount > 0)
        .map((tx) => todayISODate(new Date(tx.createdAt))),
    ),
  );
  const streak = calculateStreak(activeDates, todayISO);

  const mood = computeMood({
    tasksDueToday: tasksDueTodayList.length,
    tasksCompletedToday: tasksCompletedTodayList.length,
    currentStreak: streak,
    hourOfDay: new Date().getHours(),
  });

  return {
    mood,
    streak,
    mascotName: settings?.mascotName ?? 'Chiwi',
    userName: settings?.userName ?? 'Chiwawita',
    tasksDueToday: tasksDueTodayList.length,
    tasksCompletedToday: tasksCompletedTodayList.length,
    loading: settings === undefined,
  };
}
