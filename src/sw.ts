/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

interface PushPayload {
  title: string;
  body: string;
}

self.addEventListener('push', (event: PushEvent) => {
  let payload: PushPayload = { title: 'Chiwawapp', body: 'tienes algo pendiente 🐾' };
  try {
    if (event.data) payload = event.data.json();
  } catch {
    // best-effort — fall back to the default message above
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: `${self.registration.scope}icons/icon-192.png`,
      badge: `${self.registration.scope}icons/icon-192.png`,
      tag: 'chiwawapp-reminder',
    }),
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const scope = self.registration.scope;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      const existing = clients.find((c) => c.url.startsWith(scope));
      if (existing) return existing.focus();
      return self.clients.openWindow(scope);
    }),
  );
});
