import { BaseUser } from "better-auth";

export type UserCreatedPayload = BaseUser & { role: string | null };
