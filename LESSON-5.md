# LESSON-5 - Хранение значений и работа с DOM через useRef

## Запуск

```bash
npm ci
npm run dev # http://localhost:5173/refs
npm run build
npm run lint
```

## Чеклист задания

- [x] **ClickTimer - критерии на 3 балла.**
      [ClickTimer](src/features/refExamples/ClickTimer.tsx) хранит время первого
      клика и счётчик в одном `useRef<ClickData>`. Интерфейс содержит
      `startTime: number | null` и `clickCount: number`.
      Первый клик фиксирует `Date.now()`, следующие выводят разницу с первым
      timestamp в миллисекундах и общее количество кликов.
      Проверка `startTime === null` корректно обрабатывает timestamp `0`.
      `useState` для счётчика и времени не используется.
- [x] **PreviousInput - критерии на 3 балла.**
      [PreviousInput](src/features/refExamples/PreviousInput.tsx) отслеживает
      текущее значение через `onChange` и `useState`, а предыдущее хранит в `useRef`.
      Под полем отображается «Предыдущее значение: ...».
      Эффект обновляет DOM-элемент `<output>` через ref и `textContent`, затем
      сохраняет новое значение в ref. Чтения `ref.current` во время рендера нет,
      отдельный state для предыдущего значения не создаётся.
      Дополнительно реализован debounce на **400 мс**: история сохраняет версии
      текста после паузы ввода. Подробности ниже.
- [x] **FocusTracker - критерии на 3 балла.**
      [FocusTracker](src/features/refExamples/FocusTracker.tsx) содержит два поля
      с собственными DOM-refs и кнопку «Сфокусировать на первом».
      Кнопка вызывает `firstInputRef.current?.focus()`.
      Обработчик `onFocus` сравнивает `event.relatedTarget` с другим полем и
      увеличивает счётчик в ref только при прямом переходе между этими полями.
      Первый фокус, повторный фокус на том же поле и переход с кнопки не считаются.
      Количество переходов выводится в консоль.
- [x] **Бонус: DebouncedLogger - критерии на 1,5 балла.**
      [DebouncedLogger](src/features/refExamples/DebouncedLogger.tsx) выводит
      последний введённый текст через **1000 мс** после прекращения ввода.
      ID `setTimeout` хранится в ref, каждый `onChange` очищает предыдущий таймер.
      Callback получает строку, сохранённую из события, и сбрасывает ref после
      выполнения. При размонтировании ожидающий таймер отменяется.
      Поле неконтролируемое, `useState` не используется.
- [x] **Бонус: WebSocketLogger - критерии на 1,5 балла.**
      [WebSocketLogger](src/features/refExamples/WebSocketLogger.tsx) создаёт
      соединение в `useEffect` и хранит его в `useRef<WebSocket | null>`.
      Используется публичный echo-сервер `wss://echo.websocket.org`.
      После открытия отправляется фиксированное тестовое сообщение;
      входящие сообщения, открытие, закрытие и ошибки выводятся в консоль.
      Cleanup снимает подписки, закрывает соединение этого запуска эффекта
      и очищает ref. `useState` для WebSocket не используется.


## PreviousInput: история с debounce

Текущее поле обновляется сразу при каждом вводе. Плохая практика. История меняется только после
паузы **400 мс**, заданной константой `INPUT_DEBOUNCE_MS`.

## Уведомления

Сообщения ClickTimer, FocusTracker, DebouncedLogger и WebSocketLogger дополнительно
отображаются в уведомлениях справа. Вывод в консоль сохранён.

[ToastProvider](src/shared/ui/Toast/Toast.tsx) подключён в
[App](src/app/App.tsx). Компоненты вызывают `useToast` из публичного API `shared/ui`.
