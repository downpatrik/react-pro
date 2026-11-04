import { useLayoutEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "features/authRouting";
import { Button, ThemeContext, ToastProvider, type Theme } from "shared/ui";
import styles from "./App.module.scss";

const THEME_STORAGE_KEY = "appTheme";

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function App() {
  const { token } = useAuth();
  const [theme, setTheme] = useState(getInitialTheme);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute("data-theme");
    root.dataset.theme = theme;
    return () => {
      if (previousTheme === null) root.removeAttribute("data-theme");
      else root.setAttribute("data-theme", previousTheme);
    };
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <ThemeContext.Provider value={theme}>
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
                to="/refs"
              >
                Практика useRef
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : undefined)}
                to="/portal-showcase"
              >
                Практика Portal
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : undefined)}
                to="/react19"
              >
                Практика React 19
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : undefined)}
                to="/subscribe"
              >
                Подписка
              </NavLink>
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : undefined)}
                to="/register"
              >
                Регистрация
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
            <Button
              variant="secondary"
              className={styles.themeToggle}
              aria-pressed={theme === "dark"}
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
              Тёмная тема
            </Button>
          </header>

          <main className={styles.main}>
            <Outlet />
          </main>
        </div>
      </ToastProvider>
    </ThemeContext.Provider>
  );
}
