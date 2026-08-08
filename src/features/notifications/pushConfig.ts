/**
 * Public by design: the VAPID public key is meant to be handed to
 * PushManager.subscribe(), and PUSH_WORKER_URL/PUSH_SHARED_SECRET are baked
 * into a static client bundle anyway (there's no server to keep them behind),
 * so the shared secret is just a bar against casual abuse, not a real
 * secret — the worker never stores anything more sensitive than a push
 * subscription and two numbers (streak, doneToday).
 */
export const VAPID_PUBLIC_KEY =
  'BE41F8HNqvnTpAxTh-iu-FTByg2RIZKbVQOTKwTrgcPjS4kH6jW0LCHXe3kw0pdOg7LdEpDS54HOZditjS6Gcx0';

export const PUSH_WORKER_URL = 'https://chiwawapp-push.nicolasllerenas.workers.dev';
export const PUSH_SHARED_SECRET = 'b_tCdSdaPZhcm53bW08zpCsSnKllnOzb';

export function isPushConfigured(): boolean {
  return PUSH_WORKER_URL.length > 0;
}
