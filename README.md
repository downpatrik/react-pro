# FSD Tasks

Учебное приложение «Список задач» на **React 19 + TypeScript + Vite**.

## Запуск

```bash
npm install
npm run dev # http://localhost:5173/tasks
```

## Команды

| Команда                | Назначение                          |
| ---------------------- | ----------------------------------- |
| `npm run dev`          | dev-сервер Vite                     |
| `npm run build`        | `tsc -b` + production-сборка        |
| `npm run typecheck`    | только проверка типов               |
| `npm run lint`         | ESLint (включая правила границ FSD) |
| `npm run lint:fix`     | ESLint с автофиксом                 |
| `npm run format`       | Prettier `--write`                  |
| `npm run format:check` | Prettier `--check`                  |
| `npm run preview`      | просмотр production-сборки          |

## Структура

```
src/
├── app/                    # входная точка: bootstrap, routing, глобальные стили
│   ├── main.tsx            # точка входа (подключена в index.html)
│   ├── App.tsx             # layout приложения
│   ├── router.tsx          # маршруты: "/" -> "/tasks", "/tasks" -> TasksPage
│   └── styles/global.scss
├── entities/task/          # сущность «задача»
│   ├── model/types.ts      # тип Task/completed + доменные функции
│   ├── ui/TaskCard.tsx     # карточка задачи (+ TaskCard.module.scss)
│   └── index.ts            # публичный API
├── features/task-list/     # работа со списком задач
│   ├── model/task-list.ts  # хук useTasks: добавление, фильтрация, статус, удаление
│   ├── ui/TaskList.tsx     # фильтры + список (+ TaskList.module.scss)
│   └── index.ts
├── features/task-create/   # добавление новой задачи
│   ├── ui/TaskCreateForm.tsx (+ TaskCreateForm.module.scss)
│   └── index.ts
├── pages/tasks/            # экран «Мои задачи»
│   ├── ui/TasksPage.tsx
│   └── index.ts
└── shared/ui/              # переиспользуемые атомарные компоненты
    ├── FilterButton.tsx    # кнопка фильтра (бонусное задание)
    └── index.ts
```

Направление импортов — только вниз: `app → pages → features → entities → shared`.

Слой `widgets` не создан сознательно. В FSD он нужен для самостоятельного переиспользуемого
UI-блока, который собирает несколько нижних слоёв и используется в нескольких местах. Здесь
экран `/tasks` единственный, а `useTasks`, `TaskList` и форма создания используются только в
`TasksPage`; отдельный `TaskWidget` был бы лишь дополнительным уровнем композиции без собственной
ответственности. Поэтому экранная композиция находится в `pages/tasks`. Если появится второй
потребитель такого блока, его можно будет извлечь в `widgets/task`. Именно поэтому папка
`src/widgets/` сейчас отсутствует.

## Стили

SCSS (`sass`) + CSS Modules: каждый компонент держит свой `<Name>.module.scss` рядом с собой,
компилирует Vite. Токены темы (цвета, фон, акцент) объявлены как CSS custom properties в
`app/styles/global.scss` и потребляются остальными стилями через `var(--accent)` — так они
доступны всем слоям без `@use` через границу слоёв. Внутри файлов используется вложенность
(`.nav { a { … } }`, `&[data-active="true"]`) и SCSS-переменные для локальных значений.

## Публичный API и абсолютные импорты

Каждый слайс открывается `index.ts`, поэтому внешний код импортирует только слайс целиком:

```ts
import { TaskCard, type Task } from "entities/task";
import { TaskList, useTasks } from "features/task-list";
import { FilterButton } from "shared/ui";
```

Алиасы описаны в `tsconfig.app.json` (`paths` без `baseUrl` — он устарел в TS 6) и в
`vite.config.ts` (`resolve.alias`). Внутри слайса — относительные импорты.

## Линтинг границ слоёв

`eslint.config.js` генерирует для каждого слоя запреты `no-restricted-imports`:

- импорт вышележащих слоёв;
- импорт чужого слайса того же слоя;
- импорт внутрь чужого слайса (`entities/*/**` и т.п.) — только через публичный API;
- относительные импорты, вылезающие за пределы слайса (`../../**`).

Плюс `typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks` и
`eslint-config-prettier`; споры о стиле отданы Prettier (`.prettierrc.json`).

## Функциональность

Экран `/tasks` добавляет задачи (название обязательное, описание необязательное), показывает
список, фильтрует по статусу («Все», «В работе», «Выполненные» со счётчиками), переключает
статус и удаляет задачи. Состояние живёт в хуке `useTasks`, новая задача создаётся фабрикой
`createTask` из `entities/task` (id, дата, статус `active`) и попадает в начало списка.
