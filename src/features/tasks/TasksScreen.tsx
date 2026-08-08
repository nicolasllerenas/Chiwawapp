import { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { todayISODate, currentWeekday } from '../../shared/lib/date';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Modal } from '../../shared/ui/Modal';
import { TaskItem } from './components/TaskItem';
import { TaskForm } from './components/TaskForm';
import { isTaskDoneToday, isTaskScheduledToday } from './recurrence';
import { addTask, updateTask, deleteTask } from './taskRepo';
import type { Task } from './types';

export function TasksScreen() {
  const todayISO = todayISODate();
  const weekday = currentWeekday();
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const activeTasks = tasks.filter((t) => !t.archived);
  const today = activeTasks.filter((t) => isTaskScheduledToday(t, weekday, todayISO));
  const restOfWeek = activeTasks.filter(
    (t) => t.recurring && (t.weekdays?.length ?? 0) > 0 && !isTaskScheduledToday(t, weekday, todayISO),
  );
  const upcoming = activeTasks
    .filter((t) => !t.recurring && t.dueDate && t.dueDate > todayISO)
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));
  const someday = activeTasks.filter((t) => !t.recurring && !t.dueDate);

  function openNew() {
    setEditingTask(null);
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditingTask(task);
    setFormOpen(true);
  }

  async function handleSubmit(input: Parameters<typeof addTask>[0]) {
    if (editingTask) {
      await updateTask(editingTask.id, input);
    } else {
      await addTask(input);
    }
    setFormOpen(false);
  }

  async function handleDelete() {
    if (editingTask) await deleteTask(editingTask.id);
    setFormOpen(false);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-ink">Tareas</h1>
        <Button size="sm" onClick={openNew}>
          + Nueva
        </Button>
      </div>

      <Section title="Hoy" emptyText="nada pendiente hoy, respira tranquila 💛">
        {today.map((t) => (
          <TaskItem key={t.id} task={t} doneToday={isTaskDoneToday(t, todayISO)} onEdit={() => openEdit(t)} />
        ))}
      </Section>

      {restOfWeek.length > 0 && (
        <Section title="Resto de la semana">
          {restOfWeek.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              doneToday={isTaskDoneToday(t, todayISO)}
              onEdit={() => openEdit(t)}
              scheduledToday={false}
            />
          ))}
        </Section>
      )}

      {upcoming.length > 0 && (
        <Section title="Próximas">
          {upcoming.map((t) => (
            <TaskItem key={t.id} task={t} doneToday={isTaskDoneToday(t, todayISO)} onEdit={() => openEdit(t)} />
          ))}
        </Section>
      )}

      {someday.length > 0 && (
        <Section title="Algún día">
          {someday.map((t) => (
            <TaskItem key={t.id} task={t} doneToday={isTaskDoneToday(t, todayISO)} onEdit={() => openEdit(t)} />
          ))}
        </Section>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)}>
        <TaskForm
          initial={editingTask ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          onDelete={editingTask ? handleDelete : undefined}
        />
      </Modal>
    </div>
  );
}

function Section({ title, emptyText, children }: { title: string; emptyText?: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children : [children];
  const isEmpty = items.length === 0 || items.every((c) => c === null || c === undefined || c === false);

  return (
    <div>
      <h2 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-ink-faint">{title}</h2>
      {isEmpty ? (
        <Card className="text-center text-sm text-ink-soft">{emptyText ?? 'Nada por aquí.'}</Card>
      ) : (
        <div className="flex flex-col gap-2">{children}</div>
      )}
    </div>
  );
}
