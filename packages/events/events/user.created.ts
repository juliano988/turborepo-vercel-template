export const USER_CREATED = "user.created" as const;

export type UserCreatedPayload = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  role: string | null;
};
