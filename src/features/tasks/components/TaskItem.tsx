import { Checkbox } from '../../../shared/ui/Checkbox';
import { formatFriendlyTime } from '../../../shared/lib/date';
import { completeTask, uncompleteTask } from '../taskRepo';
import { WEEKDAY_LABELS } from '../recurrence';
import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  doneToday: boolean;
  onEdit: () => void;
  scheduledToday?: boolean;
}

export function TaskItem({ task, doneToday, onEdit, scheduledToday = true }: TaskItemProps) {
  const weekdayBadge = task.weekdays?.length ? task.weekdays.map((d) => WEEKDAY_LABELS[d]).join(' ') : null;

  const subParts = [
    task.category,
    weekdayBadge,
    task.dueTime ? formatFriendlyTime(task.dueTime) : null,
    task.recurring && (task.streakCount ?? 0) > 0 ? `🔥 ${task.streakCount}` : null,
    `+${task.points} pts`,
  ].filter(Boolean);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <Checkbox
          checked={doneToday}
          disabled={!scheduledToday}
          onChange={(checked) => (checked ? completeTask(task.id) : uncompleteTask(task.id))}
          label={task.title}
          sublabel={subParts.join(' · ')}
          emoji={task.size === 'big' ? '🌟' : '🐾'}
        />
      </div>
      <button
        type="button"
        onClick={onEdit}
        aria-label="Editar tarea"
        className="shrink-0 rounded-full p-2 text-ink-faint active:bg-surface-soft"
      >
        ✏️
      </button>
    </div>
  );
}
