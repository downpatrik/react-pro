export interface Task {
  id: number;
  userId?: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
}

export interface NewTaskInput {
  title: string;
  description?: string;
}

// Локальные задачи используют отрицательные ID, чтобы не пересекаться с положительными ID сервера.
let nextLocalId = -1;

export function createTask({ title, description }: NewTaskInput): Task {
  const trimmedDescription = description?.trim();

  return {
    id: nextLocalId--,
    title: title.trim(),
    ...(trimmedDescription ? { description: trimmedDescription } : {}),
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function isTaskDone(task: Task): boolean {
  return task.completed;
}

export function toggleTaskCompletion(task: Task): boolean {
  return !task.completed;
}

export function formatCreatedAt(createdAt: string): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(date);
}
