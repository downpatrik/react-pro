import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Укажите email")
  .pipe(z.email("Введите корректный email"));

export interface SubscriptionState {
  step: "email" | "confirmation" | "success";
  email: string;
  error: string | null;
}

export const initialSubscriptionState: SubscriptionState = {
  step: "email",
  email: "",
  error: null,
};

export async function subscriptionAction(
  previousState: SubscriptionState,
  formData: FormData,
): Promise<SubscriptionState> {
  if (formData.get("intent") === "back") {
    return { step: "email", email: previousState.email, error: null };
  }

  if (previousState.step === "success") {
    return previousState;
  }

  const rawEmail = previousState.step === "email" ? formData.get("email") : previousState.email;
  const result = emailSchema.safeParse(typeof rawEmail === "string" ? rawEmail : "");

  if (!result.success) {
    return {
      step: "email",
      email: typeof rawEmail === "string" ? rawEmail : "",
      error: result.error.issues[0].message,
    };
  }

  try {
    await new Promise<void>((resolve) => setTimeout(resolve, 500));

    return {
      step: previousState.step === "email" ? "confirmation" : "success",
      email: result.data,
      error: null,
    };
  } catch {
    return { ...previousState, error: "Не удалось отправить форму. Попробуйте ещё раз." };
  }
}
