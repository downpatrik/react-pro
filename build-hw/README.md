# Cовременная сборка фронтенд-приложений

Отдельный учебный проект для всех пунктов задания: esbuild, dev/prod,
tree shaking, code splitting, externals и дополнительная сборка через SWC.
Файлы `build.ts`, `build-swc.ts` и `check.ts` находятся прямо в `build-hw`,
инструменты esbuild, SWC и tsx установлены в этом же пакете.
Основное приложение в `../src` запускается отдельно.

## Запуск из корня репозитория

```bash
npm --prefix build-hw ci
npm --prefix build-hw run dev
# http://127.0.0.1:4177
```

В режиме dev приложение и оба формата библиотеки пересобираются при изменении
TypeScript-файлов через `context().watch()`. Минификация отключена, source maps
включены. После изменения кода обновите страницу в браузере; HMR не используется.
Остановка сервера и всех watchers: Ctrl+C.

```bash
npm --prefix build-hw run build      # production: приложение + esbuild-библиотека + SWC
npm --prefix build-hw run build:app  # только production SPA
npm --prefix build-hw run build:lib  # только production-библиотека через esbuild
npm --prefix build-hw run build:swc  # только production-библиотека через SWC
npm --prefix build-hw run typecheck # TypeScript без генерации JS
npm --prefix build-hw run check     # полная сборка и проверка её результатов
```

Из самой папки `build-hw` можно выполнять `npm ci`, `npm run dev`, `npm run check`.
Режимы передаются в `build.ts` явным аргументом `dev` или `prod`.
Прямой запуск из этой папки: `node --import tsx build.ts dev`.
Каждый запуск `dev` и полной `build` очищает предыдущую папку `dist`.
Не запускайте их одновременно с использованием одной папки результатов.

## Структура

```text
build-hw/
├── app/
│   ├── index.html
│   ├── index.ts
│   ├── utils.ts
│   ├── routes.ts
│   └── pages/{home,about}.ts
├── lib/{index,math,string}.ts
├── configs/
│   ├── esbuild.app.config.ts
│   ├── esbuild.lib.config.ts
│   └── swc.lib.config.ts
├── build.ts
├── build-swc.ts
├── check.ts
└── dist/                         # генерируется, исключена из Git
    ├── index.html
    ├── app.js + app.js.map
    ├── chunks/*.js + *.js.map
    ├── lib/esm/{index,math,string}.js + *.map
    ├── lib/cjs/{index,math,string}.cjs + *.map
    ├── swc/esm/{index,math,string}.js + *.map
    ├── swc/cjs/{index,math,string}.js + *.map
    └── meta/{app,esm,cjs}.json
```

## Выполнение критериев

| Пункт                             | Реализация                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| SPA через esbuild, 3 балла        | `app/index.ts` → `dist/app.js`; `bundle`, `splitting`, `minify`, `sourcemap`, `treeShaking` |
| Библиотека через esbuild, 3 балла | Три entry points, форматы ESM/CJS, `external` для React и lodash                            |
| Dev/prod, 3 балла                 | Общие функции конфигурации; dev с watch без minify, prod с minify и картами                 |
| Бонус SWC, 1,5 балла              | TypeScript → JS, `module.type: es6/commonjs`, minify и sourceMaps                           |
| Бонус маршрутизации, 1,5 балла    | `routes.ts`, динамические import(), отдельные чанки home/about                              |

Таблица отражает покрытие требований на максимум 12 баллов; окончательную оценку
выставляет преподаватель.

### Приложение и tree shaking

`utils.ts` экспортирует четыре функции. Приложение использует `formatCount`
и `createHeading`; `unusedDebugMessage` и `unusedSquare` не используются.
Строка `TREE_SHAKING_UNUSED_UTIL` из удаляемой функции отсутствует во всех
финальных JS-файлах приложения. Она остаётся в `sourcesContent` source maps:
карты содержат исходный TypeScript, это ожидаемо.

Для code splitting заданы `format: "esm"`, `splitting: true` и `outdir`.
Фиксированное имя entry point даёт именно `dist/app.js`; имена чанков содержат хеш.
Страницы открываются по `#/home` и `#/about`, включая прямую ссылку и кнопки
«Назад/Вперёд». Hash-маршруты работают на обычном статическом сервере без
настройки fallback. На старте вызывается loader только выбранной страницы.
Общий чанк содержит разделяемые функции; другая страница загружается при переходе.
`aria-current`, сообщение загрузки, неизвестный маршрут и ошибка import() обработаны.
Быстрое переключение маршрутов не позволяет старому запросу заменить новую страницу.

### Библиотека и внешние зависимости

`index.ts` экспортирует React-компонент `Greeting` и функции из `math.ts`/`string.ts`.
`math.ts` использует lodash для суммы, `string.ts` — для первой заглавной буквы.
Реальные импорты React/lodash позволяют проверить `external`, а не только наличие
параметра в конфиге. `bundle: true` объединяет внутренние модули, сохраняя внешние
`import`/`require`. Зависимости также объявлены в `peerDependencies` и установлены
как devDependencies для локальных проверок. Для подключения библиотеки потребителю
нужны React и lodash.

ESM имеет расширение `.js` и наследует `type: "module"` проекта. CommonJS esbuild
имеет расширение `.cjs`, поэтому `require()` работает в этом же проекте.

### SWC

SWC трансформирует каждый исходник отдельно и сохраняет модульную структуру.
Это транспиляция, без bundling: внешние зависимости остаются импортами,
относительные `./math.js` и `./string.js` продолжают работать.
Каждое дерево SWC содержит свой `package.json` с `type: "module"` или
`"commonjs"`, поэтому расширение `.js` корректно для обоих форматов.
К каждому JS добавлена ссылка `sourceMappingURL`, рядом записана карта с исходником.
SWC и esbuild сами не проверяют типы: полная команда `build` сначала запускает `tsc`.

## Как проверить результаты

`npm run check` запускает `check.ts` и проверяет готовые файлы,
а не только параметры конфигураций:

- Наличие `app.js`, карт и отдельного чанка каждой страницы.
- Отсутствие неиспользуемых функций и маркера в JS приложения.
- Динамические импорты и отсутствие страниц в статическом графе entry point.
- Минификацию JS и соответствие `sourcesContent` настоящим исходникам.
- Все три entry points и отсутствие `node_modules` во входах библиотеки по metafile.
- Внешние импорты React/lodash в ESM и CJS.
- Выполнение всех entry points esbuild и SWC через настоящий `import()` и `require()`:
  сумма, среднее, приветствие и валидный React-элемент.

Для проверки в браузере откройте DevTools → Network и выберите фильтр JS.
При открытии `#/home` загружаются `app.js`, общий чанк и `home-*.js`.
Файл `about-*.js` появится после перехода в «О сборке». В dev JS остаётся читаемым,
в prod минифицирован. Структуру бандлов также можно смотреть в `dist/meta/*.json`.

Документация: [esbuild: code splitting](https://esbuild.github.io/api/#splitting),
[watch](https://esbuild.github.io/api/#watch),
[external](https://esbuild.github.io/api/#external),
[SWC Node API](https://swc.rs/docs/usage/core),
[форматы модулей SWC](https://swc.rs/docs/configuration/modules).
