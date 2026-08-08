# Chiwawapp 🐶

App personal tipo to-do list, hecha para acompañar el día a día de una persona con Asperger y TDAH: tareas (chicas y grandes), checklist de "cosas para el bolso" antes de salir, chiwawapuntos canjeables por premios reales, sesión de enfoque tipo Pomodoro, y una mascota chihuahua que acompaña con mensajes cálidos — nunca de regaño.

Todo funciona **local y offline**: los datos viven en el dispositivo (IndexedDB), sin backend ni cuentas externas.

## Requisitos

- Node.js 20+
- npm

## Correr en desarrollo

```bash
npm install
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

## Compilar para producción

```bash
npm run build
npm run preview   # sirve el build localmente para probarlo
```

## Instalar en el celular (PWA)

- **iPhone (Safari):** abre la URL desplegada → botón Compartir → "Añadir a pantalla de inicio".
- **Tablet Samsung (Chrome):** abre la URL → aparece un banner "Instalar" (o menú ⋮ → "Instalar app").

No requiere cuenta de Apple Developer ni Google Play — es una PWA instalable directo desde el navegador.

## Desplegar en GitHub Pages (para que ella la use desde su celular)

El repo ya trae un workflow (`.github/workflows/deploy.yml`) que compila y publica la app automáticamente cada vez que se hace push a `main`. Solo falta un paso manual, una vez:

1. Sube este código a GitHub (`git push`).
2. En GitHub: **Settings → Pages → Build and deployment → Source** → elige **"GitHub Actions"**.
3. Espera a que termine el workflow (pestaña **Actions** del repo, ~1 minuto).
4. La app queda en `https://<tu-usuario>.github.io/Chiwawapp/` — esa es la URL que ella abre en su iPhone/tablet para instalarla.

Cada push a `main` después de esto la actualiza sola.

## Estructura

```
src/
├─ db/                 # esquema Dexie (IndexedDB) + datos semilla
├─ features/
│  ├─ mascot/           # mascota, estados de ánimo, mensajes
│  ├─ tasks/             # tareas (CRUD, recurrencia, puntos)
│  ├─ bagcheck/          # checklist "Modo Salida"
│  ├─ gamification/      # puntos, racha, catálogo de premios
│  ├─ focus-session/     # Pomodoro
│  ├─ music/             # playlists de Spotify embebidas
│  ├─ notifications/     # recordatorios in-app
│  └─ settings/          # onboarding, backup, ajustes
├─ shared/               # UI, tema, utilidades
└─ integrations/         # (vacío) seam para Fase 2
```

## Personalizar

Todo lo importante es editable desde la app (Ajustes / Premios / Tareas / Música), sin tocar código:

- Nombre de la mascota, hora de recordatorio del bolso.
- Catálogo de premios y su costo en puntos.
- Playlists de Spotify por estado de ánimo (pega el link, sin necesidad de cuenta).

## Fase 2 (pendiente, requiere credenciales propias)

- Integración real con Google Calendar / correo institucional UTEC — necesita crear un proyecto en Google Cloud Console y credenciales OAuth.
- Recomendaciones musicales basadas en el gusto real de Spotify — necesita registrar una app en Spotify Developer Dashboard.

Ninguna de las dos está implementada todavía; `src/integrations/` queda como el punto de entrada para conectarlas después.

## Nota sobre "modo enfoque"

La app **no puede bloquear otras apps** (TikTok, Instagram, etc.) — eso solo lo puede hacer el sistema operativo, y requiere permisos especiales que no están disponibles para una app web. En su lugar, la Sesión de Enfoque ofrece un ritual tipo Pomodoro acompañado por la mascota, y sugiere emparejarlo con el Modo de Concentración gratuito que ya trae iOS.
