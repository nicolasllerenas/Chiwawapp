import type { Task } from '../../db/db';

export interface NewTaskInput {
  title: string;
  notes?: string;
  size: Task['size'];
  category?: string;
  recurring: boolean;
  weekdays?: number[];
  dueTime?: string;
  dueDate?: string;
}

export type { Task };
