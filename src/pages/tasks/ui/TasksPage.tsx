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
  {
    id: "task-4",
    title: "Добавить форму создания задачи",
    description: "Проверить обязательное название и очистку полей после отправки",
    completed: true,
    createdAt: "2026-09-18",
  },
  {
    id: "task-5",
    title: "Настроить маршрутизацию",
    description: "Перенаправлять главную страницу на список задач",
    completed: true,
    createdAt: "2026-09-19",
  },
  {
    id: "task-6",
    title: "Проверить фильтрацию по статусу",
    description: "Все, выполненные и незавершённые задачи",
    completed: false,
    createdAt: "2026-09-20",
  },
  {
    id: "task-7",
    title: "Мемоизировать карточку задачи",
    description: "React.memo и стабильные ссылки на обработчики",
    completed: true,
    createdAt: "2026-09-21",
  },
  {
    id: "task-8",
    title: "Проверить удаление последней задачи",
    completed: false,
    createdAt: "2026-09-22",
  },
  {
    id: "task-9",
    title: "Записать профиль фильтрации",
    description: "Сравнить обновления TaskList и TaskCard в React DevTools",
    completed: false,
    createdAt: "2026-09-23",
  },
  {
    id: "task-10",
    title: "Проверить адаптивную вёрстку",
    description: "Форма, фильтры и длинные названия на узком экране",
    completed: false,
    createdAt: "2026-09-24",
  },
  {
    id: "task-11",
    title: "Описать результаты оптимизации",
    description: "Добавить скриншот Profiler и наблюдения в README",
    completed: true,
    createdAt: "2026-09-25",
  },
  {
    id: "task-12",
    title: "Подготовить домашнее задание к сдаче",
    description: "Проверить сборку, линтер и чеклист урока",
    completed: false,
    createdAt: "2026-09-26",
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
