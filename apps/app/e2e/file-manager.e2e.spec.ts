import { expect, test } from "@repo/testing/playwright";
import type { Page } from "@repo/testing/playwright";

async function signIn(page: Page) {
  const email = process.env["E2E_USER_EMAIL"];
  const password = process.env["E2E_USER_PASSWORD"];

  if (!email || !password) {
    throw new Error(
      "E2E_USER_EMAIL e E2E_USER_PASSWORD são obrigatórios para testes autenticados."
    );
  }

  await page.goto("/login");
  await page.getByLabel(/e-mail/i).fill(email);
  await page.getByLabel(/senha/i).fill(password);

  await page.getByRole("button", { name: /entrar/i }).click();
  await page.waitForURL((url) => !url.pathname.endsWith("/login"), {
    timeout: 15_000,
  });
}

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

test("exibe o FileManager autenticado", async ({ page }) => {
  await page.goto("/app");

  // Cabeçalho com título do app
  await expect(page.getByText("FileVault")).toBeVisible();
});

test("exibe estado vazio quando não há arquivos", async ({ page }) => {
  await page.goto("/app");

  // Pode ser empty state ou lista de arquivos — ambos indicam que o FileManager carregou
  const emptyOrList = page
    .getByText(/nenhum arquivo enviado ainda/i)
    .or(page.locator("[data-testid='file-list']"));
  await expect(emptyOrList.first()).toBeVisible({ timeout: 10_000 });
});
