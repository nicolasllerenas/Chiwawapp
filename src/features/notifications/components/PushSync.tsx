import { useEffect } from 'react';
import { useMascot } from '../../mascot/useMascot';
import { todayISODate } from '../../../shared/lib/date';
import { syncPushState } from '../pushClient';
import { hasNotificationPermission } from '../notificationApi';

// Mounted once, app-wide: keeps the push worker's tiny bit of state (streak,
// whether she's done something today) fresh so the daily nudge can be
// "don't lose your 5-day streak" instead of a generic ping. No task
// content ever leaves the device, just these two numbers.
export function PushSync() {
  const { streak, tasksCompletedToday, loading } = useMascot();

  useEffect(() => {
    if (loading || !hasNotificationPermission()) return;
    syncPushState(streak, tasksCompletedToday > 0, todayISODate());
  }, [streak, tasksCompletedToday, loading]);

  return null;
}
