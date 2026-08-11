import { expect, test } from "@repo/testing/playwright";
import type { Page } from "@repo/testing/playwright";

async function applyVercelBypassIfNeeded(page: Page) {
  const bypassSecret = process.env["VERCEL_AUTOMATION_BYPASS_SECRET"];

  if (!bypassSecret) {
    return;
  }

  const params = new URLSearchParams({
    "x-vercel-protection-bypass": bypassSecret,
    "x-vercel-set-bypass-cookie": "true",
  });

  await page.goto(`/?${params.toString()}`, { waitUntil: "domcontentloaded" });
}

async function signIn(page: Page) {
  const email = process.env["E2E_USER_EMAIL"];
  const password = process.env["E2E_USER_PASSWORD"];

  if (!email || !password) {
    throw new Error(
      "E2E_USER_EMAIL e E2E_USER_PASSWORD são obrigatórios para testes autenticados."
    );
  }

  await applyVercelBypassIfNeeded(page);
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

test("exibe dashboard admin autenticado", async ({ page }) => {
  await page.goto("/admin");

  await expect(page.getByText("Base simples com menu lateral")).toBeVisible();
  await expect(page.getByText("Dashboard").first()).toBeVisible();
});
