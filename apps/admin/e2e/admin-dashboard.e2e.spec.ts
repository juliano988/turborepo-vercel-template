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

  await Promise.all([
    page.waitForResponse(
      (response) =>
        response.url().includes("/api/auth/sign-in/email") &&
        response.status() === 200,
      { timeout: 15_000 }
    ),
    page.getByRole("button", { name: /entrar/i }).click(),
  ]);
}

test.beforeEach(async ({ page }) => {
  await signIn(page);
});

test("exibe dashboard admin autenticado", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByText("Base simples com menu lateral")).toBeVisible();
  await expect(page.getByText("Dashboard").first()).toBeVisible();
});
