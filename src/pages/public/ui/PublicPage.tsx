import { Link } from "react-router-dom";
import { useAuth } from "features/authRouting";
import styles from "./PublicPage.module.scss";

export function PublicPage() {
  const { token } = useAuth();

  return (
    <section className={styles.page}>
      <h1>Открытая страница</h1>
      <p>Эта страница доступна всем. Для просмотра личного профиля войдите в аккаунт.</p>
      <Link to={token ? "/profile" : "/login"}>
        {token ? "Перейти в профиль" : "Войти в аккаунт"}
      </Link>
    </section>
  );
}
