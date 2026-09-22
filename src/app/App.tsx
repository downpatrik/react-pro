import { NavLink, Outlet } from "react-router-dom";
import styles from "./App.module.scss";

export function App() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <span className={styles.logo}>FSD Tasks</span>
        <nav className={styles.nav}>
          <NavLink className={({ isActive }) => (isActive ? styles.active : undefined)} to="/tasks">
            Задачи
          </NavLink>
        </nav>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
