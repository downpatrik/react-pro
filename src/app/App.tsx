import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "features/authRouting";
import { ToastProvider } from "shared/ui";
import styles from "./App.module.scss";

export function App() {
  const { token } = useAuth();

  return (
    <ToastProvider>
      <div className={styles.layout}>
        <header className={styles.header}>
          <span className={styles.logo}>React PRO</span>
          <nav className={styles.nav} aria-label="Основная навигация">
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : undefined)}
              to="/tasks"
            >
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
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : undefined)}
              to="/refs"
            >
              Практика useRef
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : undefined)}
              to="/public"
            >
              Открытая страница
            </NavLink>
            <NavLink
              className={({ isActive }) => (isActive ? styles.active : undefined)}
              to={token ? "/profile" : "/login"}
            >
              {token ? "Профиль" : "Вход"}
            </NavLink>
          </nav>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </ToastProvider>
  );
}
