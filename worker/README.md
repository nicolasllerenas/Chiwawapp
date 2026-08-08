# chiwawapp-push

Mini servidor (Cloudflare Worker) que manda el recordatorio diario tipo Duolingo — el único pedazo de Chiwawapp que no vive 100% en el celular, porque una notificación real necesita algo que la mande incluso con la app cerrada.

Desplegado en: `https://chiwawapp-push.nicolasllerenas.workers.dev`

## Qué guarda

Solo dos cosas, en Cloudflare KV:
- `subscription`: el identificador técnico de push de su celular (no es información personal).
- `syncState`: `{ streak, doneToday }` — dos números, nada de tareas ni notas.

## Qué hace

- `POST /subscribe`: el celular registra su suscripción push (se llama sola cuando ella activa notificaciones).
- `POST /sync`: el celular manda su racha actual, sin detalle.
- Cron diario (7pm hora Perú): si no ha hecho nada hoy, manda un empujoncito. Si ya hizo algo, no manda nada — no molestar por molestar.

## Redesplegar después de cambios

```bash
cd worker
npm install
npx wrangler deploy
```

## Cambiar la hora del recordatorio diario

Edita `crons` en `wrangler.toml` (está en UTC; Perú es UTC-5 todo el año) y vuelve a desplegar.

## Secretos (ya configurados, no hace falta tocarlos)

```bash
npx wrangler secret put VAPID_PRIVATE_KEY
npx wrangler secret put SHARED_SECRET
```
