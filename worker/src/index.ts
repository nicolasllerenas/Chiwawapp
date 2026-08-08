import {
  buildPushPayload,
  type PushSubscription,
  type VapidKeys,
} from '@block65/webcrypto-web-push';

export interface Env {
  CHIWAWAPP_KV: KVNamespace;
  VAPID_SUBJECT: string;
  VAPID_PUBLIC_KEY: string;
  VAPID_PRIVATE_KEY: string;
  SHARED_SECRET: string;
}

interface SyncState {
  streak: number;
  doneToday: boolean;
  todayISO: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Chiwawapp-Secret',
};

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

function authorized(req: Request, env: Env): boolean {
  return req.headers.get('X-Chiwawapp-Secret') === env.SHARED_SECRET;
}

// This worker exists purely to wake her phone even when the app is closed —
// it never sees her tasks, notes, or points, only a subscription endpoint
// and two harmless numbers (streak, doneToday) needed to pick a message.
export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if (req.method === 'OPTIONS') return new Response(null, { headers: CORS_HEADERS });
    const url = new URL(req.url);

    if (url.pathname === '/subscribe' && req.method === 'POST') {
      if (!authorized(req, env)) return json({ error: 'unauthorized' }, 401);
      const subscription = await req.json<PushSubscription>();
      await env.CHIWAWAPP_KV.put('subscription', JSON.stringify(subscription));
      return json({ ok: true });
    }

    if (url.pathname === '/sync' && req.method === 'POST') {
      if (!authorized(req, env)) return json({ error: 'unauthorized' }, 401);
      const state = await req.json<SyncState>();
      await env.CHIWAWAPP_KV.put('syncState', JSON.stringify(state));
      return json({ ok: true });
    }

    if (url.pathname === '/send-test' && req.method === 'POST') {
      if (!authorized(req, env)) return json({ error: 'unauthorized' }, 401);
      const sent = await sendReminder(env, true);
      return json({ ok: true, sent });
    }

    return json({ ok: true, service: 'chiwawapp-push' });
  },

  async scheduled(_event: ScheduledController, env: Env): Promise<void> {
    await sendReminder(env, false);
  },
} satisfies ExportedHandler<Env>;

const NUDGE_MESSAGES = [
  { title: 'Chiwi te extraña 🐾', body: '¿ya revisaste tus tareas de hoy?' },
  { title: 'oe', body: 'no te olvides de tu bolso antes de salir 🎒' },
  { title: 'psst', body: 'un ratito de enfoque no estaría mal ahorita' },
  { title: 'Chiwawita', body: 'una cosita chiquita y ya, tú puedes' },
];

async function sendReminder(env: Env, force: boolean): Promise<boolean> {
  const raw = await env.CHIWAWAPP_KV.get('subscription');
  if (!raw) return false;
  const subscription: PushSubscription = JSON.parse(raw);

  const syncRaw = await env.CHIWAWAPP_KV.get('syncState');
  const sync: SyncState | null = syncRaw ? JSON.parse(syncRaw) : null;

  // Already on top of things today — leave her alone, don't nag for nothing.
  if (!force && sync?.doneToday) return false;

  let title: string;
  let body: string;
  if (sync && sync.streak > 0) {
    title = `no pierdas tu racha de ${sync.streak} días 🔥`;
    body = 'solo una cosita chiquita y listo';
  } else {
    const m = NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)];
    title = m.title;
    body = m.body;
  }

  const vapid: VapidKeys = {
    subject: env.VAPID_SUBJECT,
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
  };

  const payload = await buildPushPayload(
    { data: JSON.stringify({ title, body }), options: { ttl: 3600, urgency: 'normal' } },
    subscription,
    vapid,
  );

  const res = await fetch(subscription.endpoint, payload);
  if (res.status === 404 || res.status === 410) {
    await env.CHIWAWAPP_KV.delete('subscription');
  }
  return res.ok;
}
