import { TaskCreateForm } from "features/task-create";
import { TaskList, useTasks } from "features/task-list";
import styles from "./TasksPage.module.scss";

export function TasksPage() {
  const {
    tasks,
    counts,
    filter,
    setFilter,
    addTask,
    toggleTask,
    removeTask,
    isLoading,
    isError,
    refetch,
  } = useTasks();

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Мои задачи</h1>
        <p className={styles.subtitle}>Список с фильтрацией по статусу и управлением задачами.</p>
      </header>

      <TaskCreateForm onSubmit={addTask} />

      <TaskList
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
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
