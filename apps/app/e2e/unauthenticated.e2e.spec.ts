import { expect, test } from "@repo/testing/playwright";

// Sem sessão ativa o AuthGuard renderiza o estado de não autorizado
test("redireciona para login quando não autenticado", async ({ page }) => {
  await page.goto("/app");

  await expect(page.getByText("Sem autorização")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /ir para o login/i })
  ).toBeVisible();
});
