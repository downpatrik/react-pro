import {
  ClickTimer,
  PreviousInput,
  FocusTracker,
  DebouncedLogger,
  WebSocketLogger,
} from "features/refExamples";
import styles from "./RefsPage.module.scss";

export function RefsPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Практика useRef</h1>
        <p>Хранение значений между рендерами и работа с DOM.</p>
        <p className={styles.consoleHint}>
          Клики, переходы фокуса, текст с задержкой и сообщения WebSocket появляются в уведомлениях
          справа и исчезают через 4 секунды. Сообщения также остаются в консоли браузера.
        </p>
      </header>

      <div className={styles.examples}>
        <section className={styles.card} aria-labelledby="click-timer-title">
          <h2 id="click-timer-title">1. Таймер кликов</h2>
          <p>Первый клик запускает отсчёт. Следующие выводят время и общее число кликов.</p>
          <ClickTimer />
        </section>

        <section className={styles.card} aria-labelledby="previous-input-title">
          <h2 id="previous-input-title">2. Предыдущее значение</h2>
          <p>Под полем отображается текст, зафиксированный после предыдущей паузы во вводе.</p>
          <PreviousInput />
        </section>

        <section className={styles.card} aria-labelledby="focus-tracker-title">
          <h2 id="focus-tracker-title">3. Управление фокусом</h2>
          <p>
            Переключайтесь между полями. Первый фокус и переходы с кнопки не увеличивают счётчик.
          </p>
          <FocusTracker />
        </section>

        <section className={styles.card} aria-labelledby="debounced-logger-title">
          <h2 id="debounced-logger-title">4. Debounce · бонус</h2>
          <p>Последний текст появится в уведомлении и консоли после паузы в одну секунду.</p>
          <DebouncedLogger />
        </section>

        <section className={styles.card} aria-labelledby="websocket-logger-title">
          <h2 id="websocket-logger-title">5. WebSocket · бонус</h2>
          <WebSocketLogger />
        </section>
      </div>
    </section>
  );
}
