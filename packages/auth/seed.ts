import { prisma } from "@repo/db";
import { auth } from "./auth";

export async function seedFirstUser(): Promise<void> {
  console.debug("[auth:seed] Iniciando seedFirstUser");

  const email = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;

  console.debug("[auth:seed] Variáveis de ambiente lidas:", {
    ADMIN_USER: email ? `${email.slice(0, 3)}***` : undefined,
    ADMIN_PASS: password ? "***" : undefined,
  });

  if (!email || !password) {
    console.error("[auth] Email e/ou senha não definidos");
    return;
  }

  console.log(`[auth] Primeiro usuário: ${email} sendo criado`);

  console.debug("[auth:seed] Consultando contagem de usuários no banco");
  const count = await prisma.authUser.count();
  console.debug(`[auth:seed] Usuários existentes: ${count}`);

  if (count > 0) {
    console.debug("[auth:seed] Usuários já existem, seed ignorado");
    return;
  }

  console.debug("[auth:seed] Criando usuário admin via auth.api.createUser");
  await auth.api.createUser({
    body: {
      email,
      password,
      name: "Admin",
      role: "admin",
    },
  });

  console.log(`[auth] Primeiro usuário criado: ${email}`);
  console.debug("[auth:seed] seedFirstUser concluído com sucesso");
}

if (import.meta.main) {
  console.debug("[auth:seed] Executando seed como entry point");
  try {
    await seedFirstUser();
  } catch (err) {
    console.error("[auth] Seed falhou (não crítico):", err);
    process.exit(0);
  }
}
