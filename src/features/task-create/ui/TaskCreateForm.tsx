import { useState, type FormEvent } from "react";
import type { NewTaskInput } from "entities/task";
import styles from "./TaskCreateForm.module.scss";

interface TaskCreateFormProps {
  onSubmit: (input: NewTaskInput) => void;
}

export function TaskCreateForm({ onSubmit }: TaskCreateFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = title.trim().length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    onSubmit({ title, description });
    setTitle("");
    setDescription("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        className={styles.field}
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Что нужно сделать?"
        aria-label="Название задачи"
      />
      <input
        className={styles.field}
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Описание (необязательно)"
        aria-label="Описание задачи"
      />
      <button type="submit" className={styles.submit} disabled={!canSubmit}>
        Добавить задачу
      </button>
    </form>
  );
}
