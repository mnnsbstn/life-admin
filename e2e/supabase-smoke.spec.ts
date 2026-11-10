import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const configured =
  process.env.E2E_DATA_SOURCE === "supabase" &&
  Boolean(process.env.E2E_SUPABASE_URL) &&
  Boolean(process.env.E2E_SUPABASE_ANON_KEY) &&
  Boolean(process.env.E2E_USER_EMAIL) &&
  Boolean(process.env.E2E_USER_PASSWORD);

test.describe("Supabase backend smoke", () => {
  test.skip(!configured, "Set E2E_DATA_SOURCE=supabase and E2E_* credentials");

  test("sign-in reaches today dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("E-Mail").fill(process.env.E2E_USER_EMAIL!);
    await page.getByLabel("Passwort").fill(process.env.E2E_USER_PASSWORD!);
    await page.getByRole("button", { name: "Anmelden" }).click();
    await expect(page).toHaveURL(/\/today/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("uploads a document and opens download redirect", async ({ page }) => {
    test.setTimeout(90_000);

    await page.goto("/login");
    await page.getByLabel("E-Mail").fill(process.env.E2E_USER_EMAIL!);
    await page.getByLabel("Passwort").fill(process.env.E2E_USER_PASSWORD!);
    await page.getByRole("button", { name: "Anmelden" }).click();
    await expect(page).toHaveURL(/\/today/);

    const title = `E2E Upload ${Date.now()}`;
    const fixturePath = path.join(process.cwd(), "e2e/fixtures/smoke.txt");
    fs.writeFileSync(fixturePath, "life-admin e2e upload\n", "utf8");

    await page.goto("/documents/new");
    await page.getByLabel("Titel").fill(title);
    await page.locator("#document-file").setInputFiles(fixturePath);
    await page.getByRole("button", { name: "Dokument anlegen" }).click();

    await expect(page).toHaveURL(/\/documents\/[^/]+$/);
    const downloadLink = page.getByRole("link", { name: "Download" });
    await expect(downloadLink).toBeVisible();

    const href = await downloadLink.getAttribute("href");
    expect(href).toMatch(/\/documents\/[^/]+\/download/);
  });
});
