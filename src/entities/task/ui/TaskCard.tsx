import { formatCreatedAt, isTaskDone, type Task } from "../model/types";
import styles from "./TaskCard.module.scss";

interface TaskCardProps {
  task: Task;
  onToggle: (id: Task["id"]) => void;
  onRemove: (id: Task["id"]) => void;
}

export function TaskCard({ task, onToggle, onRemove }: TaskCardProps) {
  const done = isTaskDone(task);

  return (
    <li className={done ? `${styles.card} ${styles.done}` : styles.card}>
      <label className={styles.toggle}>
        <input
          type="checkbox"
          checked={done}
          aria-label={`Статус: ${done ? "выполнена" : "в работе"}`}
          onChange={() => onToggle(task.id)}
        />
        <span className={styles.title}>{task.title}</span>
      </label>

      {task.description ? <p className={styles.description}>{task.description}</p> : null}

      <div className={styles.meta}>
        <time className={styles.date} dateTime={task.createdAt}>
          {formatCreatedAt(task.createdAt)}
        </time>
        <button type="button" className={styles.action} onClick={() => onToggle(task.id)}>
          {done ? "Вернуть в работу" : "Отметить выполненной"}
        </button>
        <button type="button" className={styles.remove} onClick={() => onRemove(task.id)}>
          Удалить
        </button>
      </div>
    </li>
  );
}
