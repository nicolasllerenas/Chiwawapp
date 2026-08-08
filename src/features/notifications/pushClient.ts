import { PUSH_WORKER_URL, PUSH_SHARED_SECRET, VAPID_PUBLIC_KEY, isPushConfigured } from './pushConfig';
import { requestNotificationPermission } from './notificationApi';

function isPushSupported(): boolean {
  return (
    isPushConfigured() &&
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

// PushManager.subscribe wants the VAPID key as raw bytes, not the
// base64url string it's normally shared as.
function urlBase64ToUint8Array(base64url: string): Uint8Array {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function postToWorker(path: string, body: unknown): Promise<boolean> {
  try {
    const res = await fetch(`${PUSH_WORKER_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Chiwawapp-Secret': PUSH_SHARED_SECRET },
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Real push (arrives even with the app fully closed) needs iOS Safari's PWA
// to be installed to the home screen — a background browser tab can't do
// it there. Every failure path here is a silent no-op: this is a bonus on
// top of the in-app reminders, never something the rest of the app depends on.
export async function subscribeToPush(): Promise<boolean> {
  if (!isPushSupported()) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as BufferSource,
      });
    }
    return postToWorker('/subscribe', subscription.toJSON());
  } catch {
    return false;
  }
}

export async function requestPermissionAndSubscribe(): Promise<void> {
  const permission = await requestNotificationPermission();
  if (permission === 'granted') await subscribeToPush();
}

export async function syncPushState(streak: number, doneToday: boolean, todayISO: string): Promise<void> {
  if (!isPushSupported()) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return;
    await postToWorker('/sync', { streak, doneToday, todayISO });
  } catch {
    // best-effort only
  }
}
