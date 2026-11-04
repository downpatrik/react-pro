# LESSON-8 - Расширенное применение React Portal

## Запуск

```bash
npm ci
npm run dev # http://localhost:5173/portal-showcase
npm run build
npm run lint
```

- `#/portal-showcase` - практика Portal.

## Чеклист задания

- [x] **Tooltip - критерии на 3 балла.**
      [Tooltip](src/shared/ui/Tooltip/Tooltip.tsx) отображает `content` через
      `createPortal` в `#tooltip-root`. Положение задаётся через `position`;
      [TooltipPosition](src/shared/ui/Tooltip/TooltipPosition.ts) содержит enum
      с вариантами `Top`, `Bottom`, `Left` и `Right`.
      Подсказка появляется сразу при наведении или фокусе, скрывается при уходе
      курсора и потере фокуса. Escape закрывает её до следующего взаимодействия.
- [x] **События и изоляция - критерии на 3 балла.**
      На странице есть блок с `onClick` и счётчиком. Клик по вложенной кнопке
      всплывает к родителю, наведение открывает подсказку без изменения счётчика.
      `pointer-events: none` позволяет взаимодействовать с элементами под
      подсказкой. Стили изолированы SCSS-модулями, шрифт и цвета заданы отдельно.
      Tooltip выходит за границы родителя с `overflow: hidden`.
- [x] **ConfirmDialog - критерии на 3 балла.**
      [ConfirmDialog](src/shared/ui/ConfirmDialog/ConfirmDialog.tsx) рендерится
      через портал в `#confirm-dialog-root`. Принимает заголовок и описание,
      показывает кнопки «Подтвердить» и «Отмена».
      [useConfirmDialog](src/shared/ui/ConfirmDialog/useConfirmDialog.ts)
      возвращает `showConfirmDialog(options): Promise<boolean>`:
      подтверждение даёт `true`, отмена - `false`.
- [x] **PortalShowcase - критерии на 1 балл.**
      [PortalShowcase](src/pages/portal-showcase/ui/PortalShowcase.tsx) объединяет
      оба портала, выбор положения Tooltip и проверку всплытия событий.
      Кнопка «Удалить» открывает диалог; положительный результат удаляет
      тестовый элемент из состояния страницы. «Восстановить элемент» позволяет
      повторить пример. Результат действия отображается через существующий Toast.
- [x] **Бонус: React Context внутри портала - критерий на 1 балл.**
      [ThemeContext](src/shared/ui/Theme/ThemeContext.ts) передаёт тему
      `light | dark`. Tooltip, ConfirmDialog и Toast читают её через `useTheme()`.
      Provider находится в [App](src/app/App.tsx), поэтому значение контекста
      доступно всем страницам и порталам, хотя их DOM-контейнеры находятся
      вне основного `#root`.