# LESSON-3 — RTK Query и управление задачами

Ветка: `lesson-3`.

## Запуск

```bash
npm ci
npm run dev # http://localhost:5173/tasks
npm run build
npm run lint
```

## Чеклист

- [x] API задач через RTK Query — критерий на 3 балла.
      В [tasksApi](src/entities/task/api/tasksApi.ts) реализован типизированный
      `getTasks`, который загружает задачи с JSONPlaceholder по пути `/todos`.
      Используется `transformResponse`, экспортируется `useGetTasksQuery`.
- [x] Отображение загруженных задач — критерий на 3 балла.
      [useTasks](src/features/task-list/model/useTasks.ts) вызывает `useGetTasksQuery`
      и копирует данные в `useState`. [TasksPage](src/pages/tasks/ui/TasksPage.tsx)
      передаёт результат в [TaskList](src/features/task-list/ui/TaskList.tsx),
      который отображает задачи через [TaskCard](src/entities/task/ui/TaskCard.tsx).
      Сохранены типизация и направление импортов FSD.
- [x] Локальное удаление — критерий на 3 балла.
      Данные копируются через `useEffect`. Функция `removeTask(id: number)`
      удаляет задачу из локального состояния функциональным обновлением `setTasks`.
      Карточка исчезает из интерфейса, счётчики обновляются; запросов на удаление нет.
- [x] Бонус: общий `baseApi` и `injectEndpoints` — критерий на 3 балла.
      В [baseApi](src/shared/api/baseApi.ts) настроены `createApi`, `fetchBaseQuery`,
      `reducerPath: "api"`, базовый URL и `tagTypes: ["Tasks"]`.
      `tasksApi` расширяет общий API через `injectEndpoints`.
      В [store](src/app/store.ts) reducer и middleware подключены по одному разу,
      а в [main.tsx](src/app/main.tsx) добавлен Redux `Provider`.

