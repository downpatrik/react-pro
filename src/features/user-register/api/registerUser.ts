import type { RegistrationValues } from "../model/registrationSchema";

export interface RegisteredUser {
  id: string;
  username: string;
  email: string;
  socialLinks: string[];
}

export async function registerUser(values: RegistrationValues): Promise<RegisteredUser> {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));

  return {
    id: crypto.randomUUID(),
    username: values.username,
    email: values.email,
    socialLinks: values.socialLinks.map(({ url }) => url),
  };
}
