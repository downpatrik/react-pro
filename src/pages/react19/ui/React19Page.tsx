import {
  ActionStateWithReducer,
  FormWithAsyncSave,
  TodoListOptimistic,
} from "features/react19Examples";
import styles from "./React19Page.module.scss";

export function React19Page() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Практика React 19</h1>
        <p>Асинхронные формы и оптимистичное обновление списка.</p>
        <p>Сохранение имитируется за одну секунду. Данные хранятся до ухода со страницы.</p>
      </header>
      <div className={styles.examples}>
        <section className={styles.card} aria-labelledby="async-save-title">
          <h2 id="async-save-title">1. Асинхронное сохранение</h2>
          <p>
            Сохраните текст: кнопка покажет процесс и результат, затем вернётся в исходное
            состояние.
          </p>
          <FormWithAsyncSave />
        </section>
        <section className={styles.card} aria-labelledby="optimistic-title">
          <h2 id="optimistic-title">2. Оптимистичный список</h2>
          <p>
            Новая задача появляется сразу. Через секунду сервер с вероятностью 50% откажет в
            сохранении.
          </p>
          <TodoListOptimistic />
        </section>
        <section className={styles.card} aria-labelledby="reducer-title">
          <h2 id="reducer-title">3. Форма с редюсером · бонус</h2>
          <p>Измените имя и email. После сохранения поля очистятся, а результат останется ниже.</p>
          <ActionStateWithReducer />
        </section>
      </div>
    </section>
  );
}
