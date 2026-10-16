import { useId, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button, FormField } from "shared/ui";
import { registerUser, type RegisteredUser } from "../api/registerUser";
import {
  getRegistrationDefaults,
  registrationSchema,
  type RegistrationValues,
} from "../model/registrationSchema";
import styles from "./UserRegistrationForm.module.scss";

export function UserRegistrationForm() {
  const id = useId();
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: getRegistrationDefaults(),
    mode: "onTouched",
  });
  const { fields, append, remove } = useFieldArray({ control, name: "socialLinks" });

  async function onSubmit(values: RegistrationValues) {
    try {
      const user = await registerUser(values);
      reset(getRegistrationDefaults());
      setRegisteredUser(user);
    } catch {
      setError("root", { message: "Не удалось отправить форму. Попробуйте ещё раз." });
    }
  }

  if (registeredUser) {
    return (
      <div className={styles.result}>
        <div className={styles.success} role="status">
          <CheckCircle2 size={24} aria-hidden="true" />
          <div>
            <h2>Данные регистрации приняты</h2>
            <p>
              {registeredUser.username}, ваш email: {registeredUser.email}
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => setRegisteredUser(null)}>
          <Plus aria-hidden="true" />
          Заполнить снова
        </Button>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isSubmitting}
    >
      <fieldset className={styles.fields} disabled={isSubmitting}>
        <FormField
          id={`${id}-username`}
          label="Имя пользователя"
          autoComplete="username"
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
        <fieldset className={styles.links}>
          <legend>Социальные ссылки</legend>
          <div className={styles.linkFields}>
            {fields.map((field, index) => (
              <div className={styles.linkRow} key={field.id}>
                <FormField
                  id={`${id}-link-${field.id}`}
                  label={`Ссылка ${index + 1}`}
                  type="url"
                  placeholder="https://github.com/username"
                  error={errors.socialLinks?.[index]?.url?.message}
                  {...register(`socialLinks.${index}.url`)}
                />
                <Button
                  variant="icon"
                  aria-label={`Удалить ссылку ${index + 1}`}
                  title="Удалить ссылку"
                  onClick={() => remove(index)}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="secondary" onClick={() => append({ url: "" })}>
            <Plus aria-hidden="true" />
            Добавить ссылку
          </Button>
        </fieldset>
        {errors.root?.message ? (
          <p className={styles.error} role="alert">
            {errors.root.message}
          </p>
        ) : null}
        <div className={styles.actions}>
          <Button type="submit">
            {isSubmitting ? "Отправка..." : "Зарегистрироваться"}
          </Button>
          {isSubmitting ? <span role="status">Отправляем данные...</span> : null}
        </div>
      </fieldset>
    </form>
  );
}
