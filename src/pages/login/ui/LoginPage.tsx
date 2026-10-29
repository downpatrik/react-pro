import { useEffect, useId, useRef } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { getLoginErrorMessage, useAuth, useLoginMutation } from "features/authRouting";
import { Button, FormField } from "shared/ui";
import styles from "./LoginPage.module.scss";

interface LoginValues {
  email: string;
  password: string;
}

const emailSchema = z.email();

export function LoginPage() {
  const id = useId();
  const navigate = useNavigate();
  const { token, login } = useAuth();
  const [sendLogin] = useLoginMutation();
  const requestRef = useRef<ReturnType<typeof sendLogin> | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ defaultValues: { email: "", password: "" }, mode: "onTouched" });

  useEffect(
    () => () => {
      requestRef.current?.abort();
      requestRef.current = null;
    },
    [],
  );

  async function onSubmit(values: LoginValues) {
    const request = sendLogin(values);
    requestRef.current = request;
    try {
      const nextToken = await request.unwrap();
      if (requestRef.current !== request) return;
      login(nextToken);
      navigate("/profile", { replace: true });
    } catch (error) {
      if (requestRef.current !== request) return;
      setError("root", { message: getLoginErrorMessage(error) });
    } finally {
      if (requestRef.current === request) requestRef.current = null;
      request.reset();
    }
  }

  if (token) return <Navigate to="/profile" replace />;

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Вход</h1>
        <p>Войдите в аккаунт, чтобы открыть свой профиль.</p>
      </header>
      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        noValidate
        aria-busy={isSubmitting}
      >
        <fieldset className={styles.fields} disabled={isSubmitting}>
          <FormField
            id={`${id}-email`}
            label="Email"
            type="email"
            autoComplete="username"
            required
            error={errors.email?.message}
            {...register("email", {
              required: "Укажите email",
              setValueAs: (value: string) => value.trim(),
              validate: (value) =>
                emailSchema.safeParse(value).success || "Введите корректный email",
            })}
          />
          <FormField
            id={`${id}-password`}
            label="Пароль"
            type="password"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register("password", { required: "Укажите пароль" })}
          />
          {errors.root?.message ? (
            <p className={styles.error} role="alert">
              {errors.root.message}
            </p>
          ) : null}
          <div className={styles.actions}>
            <Button type="submit">{isSubmitting ? "Входим..." : "Войти"}</Button>
            {isSubmitting ? <span role="status">Проверяем данные...</span> : null}
          </div>
        </fieldset>
      </form>
    </section>
  );
}
