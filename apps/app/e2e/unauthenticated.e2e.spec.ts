import { expect, test } from "@repo/testing/playwright";

// Sem sessão ativa o AuthGuard renderiza o estado de não autorizado
test("redireciona para login quando não autenticado", async ({ page }) => {
  await page.goto("/app");

  const unauthorizedOrLogin = page
    .getByText("Sem autorização")
    .or(page.getByRole("button", { name: /entrar/i }));

  await expect(unauthorizedOrLogin.first()).toBeVisible({ timeout: 10_000 });
});
