import { z } from "zod";

export const registrationSchema = z
  .object({
    username: z.string().trim().min(1, "Укажите имя пользователя"),
    email: z.string().trim().min(1, "Укажите email").pipe(z.email("Введите корректный email")),
    password: z
      .string()
      .min(1, "Укажите пароль")
      .min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z.string().min(1, "Подтвердите пароль"),
    socialLinks: z.array(
      z.object({
        url: z
          .string()
          .trim()
          .min(1, "Укажите ссылку или удалите поле")
          .pipe(z.url("Некорректный URL")),
      }),
    ),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type RegistrationValues = z.infer<typeof registrationSchema>;

export function getRegistrationDefaults(): RegistrationValues {
  return {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    socialLinks: [{ url: "" }],
  };
}
