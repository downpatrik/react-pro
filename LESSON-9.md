# LESSON-9 - React 19: новые хуки и оптимистичный UI

## Запуск

```bash
npm ci
npm run dev # http://localhost:5173/react19
npm run build
npm run lint
```

- `/react19` - открытая страница с тремя примерами, авторизация не требуется.

## Чеклист задания

- [x] **FormWithAsyncSave - критерии на 4 балла.**
      [FormWithAsyncSave](src/features/react19Examples/FormWithAsyncSave.tsx)
      использует `useActionState` и `<form action={submit}>`.
      Текст читается из `FormData` и сохраняется асинхронно через
      [simulateSave](src/features/react19Examples/model/simulateSave.ts).
      Во время сохранения `isPending` блокирует поля, кнопка показывает `Saving…`.
      После завершения отображаются `Saved!` и уведомление через существующий Toast,
      неконтролируемое поле автоматически очищается React.
      Через 1,5 секунды action с командой `reset` возвращает `initialState`:
      кнопка снова показывает «Сохранить». Вызов вне формы обёрнут
      в `startTransition`, таймер очищается при размонтировании.
- [x] **TodoListOptimistic - критерии на 5 баллов.**
      [TodoListOptimistic](src/features/react19Examples/TodoListOptimistic.tsx)
      использует `useOptimistic` для мгновенного добавления задачи до ответа
      имитации сервера. Временная строка имеет подпись «Сохраняется…».
      После задержки задача добавляется в подтверждённый список функциональным
      обновлением, подпись меняется на «Сохранено», появляется Toast.
      С вероятностю 50% задача не сохранится, показыается ошибка.
- [x] **Бонус: ActionStateWithReducer - критерии на 3 балла.**
      [ActionStateWithReducer](src/features/react19Examples/ActionStateWithReducer.tsx)
      передаёт кастомный `profileReducer` в `useActionState`.
      Действие `edit` переводит состояние в `dirty`, действие `save` извлекает
      из `FormData` оба поля (`name` и `email`) и асинхронно сохраняет их.
      Вложенный компонент использует `useFormStatus` для отображения `submitting`
      и блокировки полей именно во время отправки. После сохранения отображается
      `success`, оба неконтролируемых поля автоматически очищаются.
      Под формой остаются последние сохранённые значения и номер сохранения,
      который увеличивается на основе предыдущего состояния редюсера.

