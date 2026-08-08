import { db } from '../../db/db';
import { nowISO } from '../../shared/lib/date';

const BACKUP_VERSION = 1;

export async function exportBackup(): Promise<void> {
  const data = {
    version: BACKUP_VERSION,
    exportedAt: nowISO(),
    tasks: await db.tasks.toArray(),
    bagCheckItems: await db.bagCheckItems.toArray(),
    pointsTransactions: await db.pointsTransactions.toArray(),
    rewards: await db.rewards.toArray(),
    redemptions: await db.redemptions.toArray(),
    focusSessions: await db.focusSessions.toArray(),
    settings: await db.settings.toArray(),
  };

  await db.settings.update('singleton', { lastBackupAt: nowISO() });

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chiwawapp-backup-${data.exportedAt.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<{ ok: boolean; error?: string }> {
  let data: Record<string, unknown[]>;
  try {
    data = JSON.parse(await file.text());
  } catch {
    return { ok: false, error: 'El archivo no es un backup válido.' };
  }

  const tables: (keyof typeof db)[] = [
    'tasks',
    'bagCheckItems',
    'pointsTransactions',
    'rewards',
    'redemptions',
    'focusSessions',
    'settings',
  ];

  if (!tables.some((t) => Array.isArray(data[t as string]))) {
    return { ok: false, error: 'El archivo no tiene el formato esperado.' };
  }

  await db.transaction(
    'rw',
    [db.tasks, db.bagCheckItems, db.pointsTransactions, db.rewards, db.redemptions, db.focusSessions, db.settings],
    async () => {
    for (const table of tables) {
      const rows = data[table as string];
      if (!Array.isArray(rows) || rows.length === 0) continue;
      // @ts-expect-error dynamic table access across differing row types
      await db[table].clear();
      // @ts-expect-error dynamic table access across differing row types
      await db[table].bulkPut(rows);
    }
  });

  return { ok: true };
}

