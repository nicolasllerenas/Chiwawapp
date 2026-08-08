import { useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../db/db';
import { Button } from '../../../shared/ui/Button';
import { Card } from '../../../shared/ui/Card';
import { exportBackup, importBackup } from '../backupService';
import {
  isNotificationSupported,
  hasNotificationPermission,
  requestNotificationPermission,
} from '../../notifications/notificationApi';

export function SettingsScreen() {
  const settings = useLiveQuery(() => db.settings.get('singleton'), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await importBackup(file);
    setImportMsg(result.ok ? 'Backup restaurado con éxito 💛' : (result.error ?? 'No se pudo importar.'));
    e.target.value = '';
  }

  if (!settings) return null;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-lg font-extrabold text-ink">Ajustes</h2>

      <Card>
        <label className="mb-1 block text-sm font-bold text-ink-soft">Tu apodo</label>
        <input
          value={settings.userName ?? 'Chiwawita'}
          onChange={(e) => db.settings.update('singleton', { userName: e.target.value })}
          className="w-full rounded-2xl border border-border bg-cream px-4 py-2.5 text-ink outline-none focus:border-primary"
        />
      </Card>

      <Card>
        <label className="mb-1 block text-sm font-bold text-ink-soft">Nombre de tu mascota</label>
        <input
          value={settings.mascotName}
          onChange={(e) => db.settings.update('singleton', { mascotName: e.target.value })}
          className="w-full rounded-2xl border border-border bg-cream px-4 py-2.5 text-ink outline-none focus:border-primary"
        />
      </Card>

      <Card>
        <label className="mb-1 block text-sm font-bold text-ink-soft">
          Recordatorio de bolso (Modo Salida)
        </label>
        <input
          type="time"
          value={settings.bagCheckReminderTime ?? ''}
          onChange={(e) => db.settings.update('singleton', { bagCheckReminderTime: e.target.value || undefined })}
          className="w-full rounded-2xl border border-border bg-cream px-4 py-2.5 text-ink outline-none focus:border-primary"
        />
        <p className="mt-1 text-xs text-ink-faint">
          Si tu bolso no está listo después de esta hora, te lo recordamos en la app.
        </p>
      </Card>

      {isNotificationSupported() && !hasNotificationPermission() && (
        <Card className="bg-surface-soft">
          <p className="mb-2 text-sm text-ink-soft">
            Activa notificaciones para recordatorios extra (funciona mejor en Android).
          </p>
          <Button size="sm" variant="secondary" onClick={requestNotificationPermission}>
            Activar notificaciones
          </Button>
        </Card>
      )}

      <Card>
        <p className="mb-2 text-sm font-bold text-ink-soft">Respaldo de datos</p>
        <p className="mb-3 text-xs text-ink-faint">
          Tus tareas, puntos y rachas viven solo en este dispositivo. Exporta un backup de vez en
          cuando por si acaso.
        </p>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={exportBackup} className="flex-1">
            Exportar backup
          </Button>
          <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()} className="flex-1">
            Importar backup
          </Button>
        </div>
        <input ref={fileInputRef} type="file" accept="application/json" onChange={handleImportFile} className="hidden" />
        {importMsg && <p className="mt-2 text-sm text-ink-soft">{importMsg}</p>}
        {settings.lastBackupAt && (
          <p className="mt-1 text-xs text-ink-faint">
            Último backup: {new Date(settings.lastBackupAt).toLocaleString('es-PE')}
          </p>
        )}
      </Card>

      <Card className="bg-surface-soft text-xs text-ink-faint">
        <p className="font-bold text-ink-soft">Próximamente</p>
        <p className="mt-1">
          Conexión con Google Calendar/correo UTEC y recomendaciones reales de Spotify — necesitan
          credenciales propias (Google Cloud / Spotify Developer) que se configuran más adelante.
        </p>
      </Card>

      <p className="pb-1 text-center text-xs text-ink-faint">
        esto te lo hizo Pie, con harta paciencia y todo su cariño 💛
      </p>
    </div>
  );
}
