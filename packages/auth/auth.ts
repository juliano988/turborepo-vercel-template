import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI!);

const db = mongoClient.db();

function getTrustedOrigins(): string[] {
  const urlRegex = /^https?:\/\//;

  return [
    ...new Set(
      Object.values(process.env)
        .filter((v): v is string => !!v && urlRegex.test(v))
        .flatMap((v) => {
          try {
            return [new URL(v).origin];
          } catch {
            return [];
          }
        })
    ),
  ];
}

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  trustedOrigins: getTrustedOrigins(),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {},
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
