import { NavLink, Outlet } from "react-router-dom";
import styles from "./App.module.scss";

export function App() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>React PRO</span>
        <nav className={styles.nav}>
          <NavLink className={({ isActive }) => (isActive ? styles.active : undefined)} to="/tasks">
            Задачи
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to="/register"
          >
            Регистрация
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to="/subscribe"
          >
            Подписка
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
