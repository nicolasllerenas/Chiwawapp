import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { todayISODate, currentWeekday, formatFriendlyTime } from '../../shared/lib/date';
import { Card } from '../../shared/ui/Card';
import { ProgressRing } from '../../shared/ui/ProgressRing';
import { useUiStore } from '../../shared/store/uiStore';
import { MascotCard } from '../mascot/components/MascotCard';
import { PointsBadge } from '../gamification/components/PointsBadge';
import { isTaskDoneToday, isTaskScheduledToday } from '../tasks/recurrence';

export function HomeScreen() {
  const todayISO = todayISODate();
  const weekday = currentWeekday();
  const setActiveTab = useUiStore((s) => s.setActiveTab);

  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const bagItems = useLiveQuery(() => db.bagCheckItems.toArray(), []) ?? [];
  const settings = useLiveQuery(() => db.settings.get('singleton'), []);
  const userName = settings?.userName ?? 'Chiwawita';

  const todayTasks = tasks.filter((t) => !t.archived && isTaskScheduledToday(t, weekday, todayISO));
  const doneToday = todayTasks.filter((t) => isTaskDoneToday(t, todayISO));
  const nextTask = todayTasks
    .filter((t) => !isTaskDoneToday(t, todayISO))
    .sort((a, b) => (a.dueTime ?? '99:99').localeCompare(b.dueTime ?? '99:99'))[0];

  const bagChecked = bagItems.filter((i) => i.checked).length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm font-bold text-ink-faint">Hola de nuevo, {userName} 👋</p>
        <h1 className="text-2xl font-extrabold text-ink">¿Qué hacemos hoy?</h1>
      </div>

      <MascotCard />

      <div className="flex items-center justify-between">
        <PointsBadge />
      </div>

      <Card className="flex items-center gap-4">
        <ProgressRing progress={todayTasks.length ? doneToday.length / todayTasks.length : 0}>
          <span className="text-sm font-extrabold text-ink">
            {doneToday.length}/{todayTasks.length}
          </span>
        </ProgressRing>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-ink">Tareas de hoy</p>
          {nextTask ? (
            <p className="text-sm text-ink-soft">
              Siguiente: {nextTask.title}
              {nextTask.dueTime ? ` · ${formatFriendlyTime(nextTask.dueTime)}` : ''}
            </p>
          ) : (
            <p className="text-sm text-ink-soft">
              {todayTasks.length === 0 ? 'nada para hoy, tranqui' : 'ya hiciste todo hoy, en serio'}
            </p>
          )}
          <button
            type="button"
            onClick={() => setActiveTab('tareas')}
            className="mt-1 text-sm font-bold text-primary"
          >
            Ver tareas →
          </button>
        </div>
      </Card>

      <button type="button" onClick={() => setActiveTab('bolso')} className="text-left">
        <Card className="flex items-center gap-4 active:scale-[0.99]">
          <span className="text-3xl">🎒</span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-ink">Modo Salida</p>
            <p className="text-sm text-ink-soft">
              {bagItems.length === 0
                ? 'Sin objetos configurados'
                : `${bagChecked}/${bagItems.length} listos para salir`}
            </p>
          </div>
          <span className="text-ink-faint">→</span>
        </Card>
      </button>

      <button type="button" onClick={() => setActiveTab('enfoque')} className="text-left">
        <Card className="flex items-center gap-4 active:scale-[0.99]">
          <span className="text-3xl">🎯</span>
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-ink">Sesión de Enfoque</p>
            <p className="text-sm text-ink-soft">un ratito de calma, cuando quieras</p>
          </div>
          <span className="text-ink-faint">→</span>
        </Card>
      </button>
    </div>
  );
}
