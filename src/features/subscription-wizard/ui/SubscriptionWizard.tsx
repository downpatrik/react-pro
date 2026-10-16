import { useActionState, useId, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, MailCheck } from "lucide-react";
import { Button, FormField } from "shared/ui";
import { initialSubscriptionState, subscriptionAction } from "../model/subscriptionAction";
import styles from "./SubscriptionWizard.module.scss";

export function SubscriptionWizard() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, formAction, isPending] = useActionState(
    subscriptionAction,
    initialSubscriptionState,
  );

  return (
    <div className={styles.wizard}>
      <ol className={styles.steps} aria-label="Шаги подписки">
        <li aria-current={state.step === "email" ? "step" : undefined}>1. Email</li>
        <li aria-current={state.step === "confirmation" ? "step" : undefined}>2. Подтверждение</li>
      </ol>

      {state.step === "success" ? (
        <div className={styles.success} role="status">
          <CheckCircle2 size={24} aria-hidden="true" />
          <div>
            <h2>Подписка подтверждена</h2>
            <p>Адрес подписки: {state.email}</p>
          </div>
        </div>
      ) : (
        <form action={formAction} className={styles.form} noValidate aria-busy={isPending}>
          <fieldset className={styles.fields} disabled={isPending}>
            {state.step === "email" ? (
              <FormField
                id={`${id}-email`}
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={state.error ?? undefined}
                required
              />
            ) : (
              <div className={styles.confirmation}>
                <h2>Подтвердите подписку</h2>
                <p>
                  Получать письма на <strong>{state.email}</strong>?
                </p>
                {state.error ? (
                  <p className={styles.error} role="alert">
                    {state.error}
                  </p>
                ) : null}
              </div>
            )}
            <div className={styles.actions}>
              {state.step === "confirmation" ? (
                <Button type="submit" variant="secondary" name="intent" value="back">
                  <ArrowLeft aria-hidden="true" />
                  Назад
                </Button>
              ) : null}
              <Button type="submit" name="intent" value="continue">
                {state.step === "email" ? (
                  <ArrowRight aria-hidden="true" />
                ) : (
                  <MailCheck aria-hidden="true" />
                )}
                {isPending
                  ? "Отправка..."
                  : state.step === "email"
                    ? "Продолжить"
                    : "Подтвердить подписку"}
              </Button>
            </div>
          </fieldset>
          {isPending ? (
            <p className={styles.pending} role="status">
              Отправляем данные...
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
