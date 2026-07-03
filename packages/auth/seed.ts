import { prisma } from "@repo/db";
import { auth } from "./auth";

export async function seedFirstUser(): Promise<void> {
  const email = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;

  if (!email || !password) {
    console.error("[auth] Email e/ou senha não definidos")
    return;
  }

  console.log(`[auth] Primeiro usuário: ${email} sendo criado`)

  const count = await prisma.authUser.count();
  if (count > 0) return;

  await auth.api.createUser({
    body: {
      email,
      password,
      name: "Admin",
      role: "admin",
    },
  });

  console.log(`[auth] Primeiro usuário criado: ${email}`);
}

if (import.meta.main) {
  try {
    await seedFirstUser();
  } catch (err) {
    console.error("[auth] Seed falhou (não crítico):", err);
    process.exit(0);
  }
}
