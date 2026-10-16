import { UserRegistrationForm } from "features/user-register";
import styles from "./RegisterPage.module.scss";

export function RegisterPage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Регистрация</h1>
      <UserRegistrationForm />
    </section>
  );
}
