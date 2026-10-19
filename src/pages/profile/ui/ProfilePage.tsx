import { useNavigate } from "react-router-dom";
import { LogOut, RefreshCw } from "lucide-react";
import { useAuth } from "features/authRouting";
import { Button } from "shared/ui";
import styles from "./ProfilePage.module.scss";

export function ProfilePage() {
  const { user, isLoading, profileError, logout, retryProfile } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Профиль</h1>
        <p>Данные вашего аккаунта.</p>
      </header>
      <div className={styles.card} aria-busy={isLoading}>
        {isLoading ? <p role="status">Загрузка профиля...</p> : null}
        {profileError ? (
          <div className={styles.error} role="alert">
            <p>{profileError}</p>
            <Button variant="secondary" onClick={retryProfile}>
              <RefreshCw aria-hidden="true" />
              Повторить загрузку
            </Button>
          </div>
        ) : null}
        {user ? (
          <div className={styles.user}>
            <h2>{user.name}</h2>
            {user.email ? <p>{user.email}</p> : null}
          </div>
        ) : null}
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut aria-hidden="true" />
          Выйти
        </Button>
      </div>
    </section>
  );
}
