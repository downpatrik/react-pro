import { useEffect, useRef } from "react";
import { getRegisterErrorMessage, useRegisterMutation } from "features/authRouting";
import { UserRegistrationForm, type RegistrationValues } from "features/user-register";
import styles from "./RegisterPage.module.scss";

export function RegisterPage() {
  const [sendRegister] = useRegisterMutation();
  const requestRef = useRef<ReturnType<typeof sendRegister> | null>(null);

  useEffect(
    () => () => {
      requestRef.current?.abort();
      requestRef.current = null;
    },
    [],
  );

  async function registerUser(values: RegistrationValues) {
    const request = sendRegister({
      name: values.username,
      email: values.email,
      password: values.password,
      roles: values.roles,
    });
    requestRef.current = request;
    try {
      return await request.unwrap();
    } catch (error) {
      throw new Error(getRegisterErrorMessage(error));
    } finally {
      if (requestRef.current === request) requestRef.current = null;
      request.reset();
    }
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Регистрация</h1>
      <UserRegistrationForm onRegister={registerUser} />
    </section>
  );
}
