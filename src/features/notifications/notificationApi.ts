/**
 * Best-effort real system notifications. Feature-detected: Android Chrome
 * supports this from client script with no server. iOS Safari never
 * implemented `new Notification()` from page script (real push there needs
 * a server + VAPID, out of scope for v1) — `isNotificationSupported`
 * returns false there and every other function silently no-ops.
 * The reminderEngine in-app banner is the real, cross-platform mechanism;
 * this is a bonus layer only.
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function hasNotificationPermission(): boolean {
  return isNotificationSupported() && Notification.permission === 'granted';
}

export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (!isNotificationSupported()) return null;
  try {
    return await Notification.requestPermission();
  } catch {
    return null;
  }
}

export async function showLocalNotification(title: string, body: string) {
  if (!hasNotificationPermission()) return;
  const icon = `${import.meta.env.BASE_URL}icons/icon-192.png`;
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, { body, icon });
        return;
      }
    }
    new Notification(title, { body, icon });
  } catch {
    // best-effort only
  }
}
