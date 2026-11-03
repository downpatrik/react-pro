# LESSON-7 - Современная сборка фронтенд-приложений

Домашнее задание выполнено в отдельном проекте [build-hw](build-hw/README.md).
Реализованы основная часть и оба бонуса: сборка SPA и библиотеки через esbuild,
режимы dev/prod, транспиляция библиотеки через SWC и разделение кода по маршрутам.

## Запуск

Перейдите в `build-hw` и выполняйте команды из этой папки:

```bash
cd build-hw
npm ci
npm run dev # http://localhost:4177
```

- `#/home` - главная страница.
- `#/about` - описание сборки.
- Dev-сервер использует watch для приложения и ESM/CJS библиотеки.

## Структура

```text
build-hw/
├── app/             # SPA и ленивые страницы
├── lib/             # Исходники библиотеки
├── configs/         # Конфигурации esbuild и SWC
├── package.json
├── tsconfig.json
└── dist/            # Результаты сборки
```

Логика сборки находится в `configs`, а короткие команды запуска - в `package.json`.
Для esbuild используется самозапускаемый TypeScript-конфиг через API: его CLI
не умеет читать конфиги. SWC запускается через CLI с JSON-конфигами.

## Чеклист задания

- [x] **Сборка SPA через esbuild - критерии на 3 балла.**
      [Конфигурация приложения](build-hw/configs/esbuild.app.config.ts) собирает
      [app/index.ts](build-hw/app/index.ts) в `dist/app.js`. Включены `bundle`,
      `splitting`, `treeShaking`, source maps и production-минификация.
      Из [utils.ts](build-hw/app/utils.ts) используются только часть экспортов;
      `unusedDebugMessage` и `unusedSquare` удаляются из итогового JS.
- [x] **Сборка библиотеки через esbuild - критерии на 3 балла.**
      [Конфигурация библиотеки](build-hw/configs/esbuild.lib.config.ts) содержит
      три entry points: `lib/index.ts`, `lib/math.ts`, `lib/string.ts`.
      Результат записывается в `dist/lib/esm/*.js` и `dist/lib/cjs/*.cjs`.
      React и lodash используются в исходниках и исключены через `external`.
- [x] **Dev и production - критерии на 3 балла.**
      [Конфиг запуска esbuild](build-hw/configs/esbuild.config.ts) принимает режим `dev` или `prod`.
      Dev использует `context().watch()` без минификации и `serve()` для SPA.
      Prod включает минификацию, tree shaking и карты исходников.
- [x] **Бонус: SWC - критерии на 1,5 балла.**
      [Конфигурация SWC](build-hw/configs/swc.esm.json) задаёт TypeScript-парсер,
      `module.type: "es6"` / `"commonjs"`, минификацию и source maps.
      Команды `swc:esm` и `swc:cjs` используют конфиги
      [ESM](build-hw/configs/swc.esm.json) и [CommonJS](build-hw/configs/swc.cjs.json), преобразуют каждый модуль библиотеки
      и сохраняет результаты в `dist/swc/esm` и `dist/swc/cjs`.
- [x] **Бонус: code splitting по маршрутам - критерии на 1,5 балла.**
      [routes.ts](build-hw/app/routes.ts) загружает страницы `home` и `about`
      через динамические `import()`. Каждая страница получает отдельный чанк;
      на старте вызывается загрузчик только выбранного маршрута.
