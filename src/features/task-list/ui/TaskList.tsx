import { TaskCard, type Task } from "entities/task";
import { FilterButton } from "shared/ui";
import { TASK_FILTERS, type TaskFilter } from "../model/useTasks";
import styles from "./TaskList.module.scss";

interface TaskListProps {
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  tasks: readonly Task[];
  filter: TaskFilter;
  counts: Record<TaskFilter, number>;
  onFilterChange: (filter: TaskFilter) => void;
  onToggle: (id: Task["id"]) => void;
  onRemove: (id: Task["id"]) => void;
}

export function TaskList({
  isLoading,
  isError,
  onRetry,
  tasks,
  filter,
  counts,
  onFilterChange,
  onToggle,
  onRemove,
}: TaskListProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.filters}>
        {TASK_FILTERS.map((option) => (
          <FilterButton
            key={option.value}
            label={option.label}
            count={counts[option.value]}
            isActive={filter === option.value}
            onClick={() => onFilterChange(option.value)}
          />
        ))}
      </div>

      {isLoading ? <p role="status">Загрузка задач...</p> : null}
      {isError ? (
        <div role="alert">
          <p>Не удалось загрузить задачи. Проверьте подключение и попробуйте снова.</p>
          <button type="button" onClick={onRetry}>
            Повторить загрузку
          </button>
        </div>
      ) : null}

      {tasks.length === 0 ? (
        !isLoading && !isError ? (
          <p className={styles.empty}>Задач нет — выберите другой фильтр или добавьте новую.</p>
        ) : null
      ) : (
        <ul className={styles.list}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onToggle={onToggle} onRemove={onRemove} />
          ))}
        </ul>
      )}
    </div>
  );
}
