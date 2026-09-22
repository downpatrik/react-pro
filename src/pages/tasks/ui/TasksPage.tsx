import type { Task } from "entities/task";
import { TaskCreateForm } from "features/task-create";
import { TaskList, useTasks } from "features/task-list";
import styles from "./TasksPage.module.scss";

const DEMO_TASKS: readonly Task[] = [
  {
    id: "task-1",
    title: "Разобрать структуру FSD",
    description: "layers, slices, segments, публичный API",
    completed: true,
    createdAt: "2026-09-14",
  },
  {
    id: "task-2",
    title: "Подключить абсолютные импорты",
    description: "tsconfig paths + алиасы сборщика",
    completed: false,
    createdAt: "2026-09-16",
  },
  {
    id: "task-3",
    title: "Настроить ESLint и Prettier",
    completed: false,
    createdAt: "2026-09-17",
  },
];

export function TasksPage() {
  const { tasks, counts, filter, setFilter, addTask, toggleTask, removeTask } =
    useTasks(DEMO_TASKS);

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Мои задачи</h1>
        <p className={styles.subtitle}>Список с фильтрацией по статусу и управлением задачами.</p>
      </header>

      <TaskCreateForm onSubmit={addTask} />

      <TaskList
        tasks={tasks}
        counts={counts}
        filter={filter}
        onFilterChange={setFilter}
        onToggle={toggleTask}
        onRemove={removeTask}
      />
    </section>
  );
}
