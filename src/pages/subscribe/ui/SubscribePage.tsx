import { SubscriptionWizard } from "features/subscription-wizard";
import styles from "./SubscribePage.module.scss";

export function SubscribePage() {
  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Подписка</h1>
      <SubscriptionWizard />
    </section>
  );
}
