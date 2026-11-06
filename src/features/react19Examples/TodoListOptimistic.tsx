import { useActionState, useId, useOptimistic, useState } from "react";
import { Button, FormField, useToast } from "shared/ui";
import { simulateSave } from "./model/simulateSave";
import styles from "./React19Examples.module.scss";

interface Todo {
  id: string;
  text: string;
  pending?: boolean;
}

export function TodoListOptimistic() {
  const id = useId();
  const notify = useToast();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (current: Todo[], todo: Todo) =>
      current.some((item) => item.id === todo.id)
        ? current
        : [...current, { ...todo, pending: true }],
  );
  const [error, submit, isPending] = useActionState(
    async (_previous: string | null, formData: FormData): Promise<string | null> => {
      const text = String(formData.get("todo") ?? "").trim();
      if (!text) return "Введите название задачи.";

      const todo: Todo = { id: crypto.randomUUID(), text };
      addOptimisticTodo(todo);
      try {
        const savedTodo = await simulateSave(todo, 0.5);
        setTodos((current) => [...current, savedTodo]);
        notify(`Задача «${text}» сохранена.`);
        return null;
      } catch {
        const message = `Сервер отказал в сохранении задачи «${text}». Попробуйте ещё раз.`;
        notify(message, "error");
        return message;
      }
    },
    null,
  );

  return (
    <div className={styles.form}>
      <form action={submit} aria-busy={isPending}>
        <fieldset className={styles.fields} disabled={isPending}>
          <FormField
            id={`${id}-todo`}
            name="todo"
            label="Новая задача"
            placeholder="Что нужно сделать?"
            required
            maxLength={200}
            error={error ?? undefined}
          />
          <Button type="submit">{isPending ? "Сохраняем…" : "Добавить задачу"}</Button>
        </fieldset>
      </form>
      {optimisticTodos.length === 0 ? (
        <p className={styles.status}>Пока нет задач.</p>
      ) : (
        <ul className={styles.todos} aria-label="Оптимистичный список задач" aria-live="polite">
          {optimisticTodos.map((todo) => (
            <li key={todo.id} className={todo.pending ? styles.pending : undefined}>
              <span>{todo.text}</span>
              <small>{todo.pending ? "Сохраняется…" : "Сохранено"}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
