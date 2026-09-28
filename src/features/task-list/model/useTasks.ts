import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  createTask,
  useGetTasksQuery,
  type NewTaskInput,
  type Task,
  toggleTaskCompletion,
} from "entities/task";

export type TaskFilter = "all" | "incomplete" | "completed";

export interface TaskFilterOption {
  value: TaskFilter;
  label: string;
}

export const TASK_FILTERS: readonly TaskFilterOption[] = [
  { value: "all", label: "Все" },
  { value: "incomplete", label: "В работе" },
  { value: "completed", label: "Выполненные" },
];

export function useTasks() {
  const { data: remoteTasks, isLoading, isError, refetch } = useGetTasksQuery();
  const [tasks, setTasks] = useState<Task[]>([]);
  const initialized = useRef(false);
  const [filter, setFilter] = useState<TaskFilter>("all");

  useEffect(() => {
    if (remoteTasks === undefined || initialized.current) return;

    initialized.current = true;
    setTasks((current) => [...current, ...remoteTasks]);
  }, [remoteTasks]);

  const visibleTasks = useMemo(
    () =>
      filter === "all"
        ? tasks
        : tasks.filter((task) => task.completed === (filter === "completed")),
    [tasks, filter],
  );

  const counts = useMemo(
    () => ({
      all: tasks.length,
      incomplete: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
    }),
    [tasks],
  );

  const addTask = useCallback((input: NewTaskInput) => {
    const task = createTask(input);
    setTasks((current) => [task, ...current]);
  }, []);

  const toggleTask = useCallback((id: Task["id"]) => {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) {
          return task;
        }

        return { ...task, completed: toggleTaskCompletion(task) };
      }),
    );
  }, []);

  const removeTask = useCallback((id: Task["id"]) => {
    setTasks((current) => current.filter((task) => task.id !== id));
  }, []);

  return {
    tasks: visibleTasks,
    isLoading,
    isError,
    refetch,
    counts,
    filter,
    setFilter,
    addTask,
    toggleTask,
    removeTask,
  };
}
