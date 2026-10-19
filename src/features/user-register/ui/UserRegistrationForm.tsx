import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Plus } from "lucide-react";
import { Button, FormField } from "shared/ui";
import {
  getRegistrationDefaults,
  registrationSchema,
  type RegistrationValues,
} from "../model/registrationSchema";
import styles from "./UserRegistrationForm.module.scss";

interface UserRegistrationFormProps {
  onRegister: (values: RegistrationValues) => Promise<{ email: string }>;
}

export function UserRegistrationForm({ onRegister }: UserRegistrationFormProps) {
  const id = useId();
  const [registeredUser, setRegisteredUser] = useState<{ email: string } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: getRegistrationDefaults(),
    mode: "onTouched",
  });
  async function onSubmit(values: RegistrationValues) {
    try {
      const user = await onRegister(values);
      reset(getRegistrationDefaults());
      setRegisteredUser({ email: user.email });
    } catch (error) {
      setError("root", {
        message:
          error instanceof Error
            ? error.message
            : "Не удалось зарегистрироваться. Попробуйте ещё раз.",
      });
    }
  }

  if (registeredUser) {
    return (
      <div className={styles.result}>
        <div className={styles.success} role="status">
          <CheckCircle2 size={24} aria-hidden="true" />
          <div>
            <h2>Аккаунт создан</h2>
            <p>Ваш email: {registeredUser.email}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <Link to="/login">Войти в аккаунт</Link>
          <Button variant="secondary" onClick={() => setRegisteredUser(null)}>
            <Plus aria-hidden="true" />
            Заполнить снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
      aria-busy={isSubmitting}
    >
      <fieldset className={styles.fields} disabled={isSubmitting}>
        <FormField
          id={`${id}-username`}
          label="Имя пользователя"
          autoComplete="nickname"
          required
          error={errors.username?.message}
          {...register("username")}
        />
        <FormField
          id={`${id}-email`}
          label="Email"
          type="email"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
        <div className={styles.passwords}>
          <FormField
            id={`${id}-password`}
            label="Пароль"
            type="password"
            autoComplete="new-password"
            hint="Минимум 6 символов"
            required
            error={errors.password?.message}
            {...register("password", { deps: ["confirmPassword"] })}
          />
          <FormField
            id={`${id}-confirm-password`}
            label="Подтверждение пароля"
            type="password"
            autoComplete="new-password"
            required
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>
        <fieldset
          className={styles.roles}
          aria-describedby={errors.roles ? `${id}-roles-error` : undefined}
        >
          <legend>Роли</legend>
          <div className={styles.roleOptions}>
            <label>
              <input type="checkbox" value="USER" {...register("roles")} />
              Пользователь (USER)
            </label>
            <label>
              <input type="checkbox" value="ADMIN" {...register("roles")} />
              Администратор (ADMIN)
            </label>
          </div>
          {errors.roles?.message ? (
            <p id={`${id}-roles-error`} className={styles.error} role="alert">
              {errors.roles.message}
            </p>
          ) : null}
        </fieldset>
        {errors.root?.message ? (
          <p className={styles.error} role="alert">
            {errors.root.message}
          </p>
        ) : null}
        <div className={styles.actions}>
          <Button type="submit">{isSubmitting ? "Отправка..." : "Зарегистрироваться"}</Button>
          {isSubmitting ? <span role="status">Отправляем данные...</span> : null}
        </div>
        <p className={styles.loginLink}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </fieldset>
    </form>
  );
}
