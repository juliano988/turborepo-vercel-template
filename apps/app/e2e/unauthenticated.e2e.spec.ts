import { expect, test } from "@repo/testing/playwright";

// Sem sessão ativa o AuthGuard renderiza o estado de não autorizado
test("redireciona para login quando não autenticado", async ({ page }) => {
  await page.goto("/app");

  await expect(async () => {
    const pathname = new URL(page.url()).pathname;
    const isLoginPath = pathname === "/login";

    const unauthorizedVisible = await page
      .getByText("Sem autorização")
      .isVisible();
    const loginHeadingVisible = await page
      .getByRole("heading", { name: /entrar/i })
      .isVisible();
    const emailFieldVisible = await page.getByLabel(/e-mail/i).isVisible();

    if (
      !isLoginPath &&
      !unauthorizedVisible &&
      !loginHeadingVisible &&
      !emailFieldVisible
    ) {
      throw new Error("Estado de não autenticado ainda não ficou visível.");
    }
  }).toPass({
    timeout: 30_000,
    intervals: [1_000, 2_000, 5_000],
  });
});
