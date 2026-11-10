import { expect, test } from "@playwright/test";

test.describe("Mock backend smoke", () => {
  test("today dashboard loads for demo user", async ({ page }) => {
    await page.goto("/today");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Alex",
    );
    await expect(
      page.getByRole("heading", { name: "Aufmerksamkeit", level: 2 }),
    ).toBeVisible();
  });

  test("creates and deletes a reminder", async ({ page }) => {
    const title = `E2E Reminder ${Date.now()}`;

    await page.goto("/reminders/new");
    await page.getByLabel("Titel").fill(title);
    await page.getByLabel("Fällig am").fill("2030-06-01");
    await page.getByRole("button", { name: "Erinnerung anlegen" }).click();

    await expect(page).toHaveURL(/\/reminders\/[^/]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);

    await page.getByRole("button", { name: "Löschen" }).click();
    await page.getByRole("button", { name: "Endgültig löschen" }).click();
    await expect(page).toHaveURL(/\/reminders$/);
    await expect(page.getByText(title)).toHaveCount(0);
  });

  test("creates a document with mock file metadata", async ({ page }) => {
    const title = `E2E Doc ${Date.now()}`;

    await page.goto("/documents/new");
    await page.getByLabel("Titel").fill(title);
    await page.getByLabel("Dateiname (Demo)").fill("e2e-fixture.pdf");
    await page.getByRole("button", { name: "Dokument anlegen" }).click();

    await expect(page).toHaveURL(/\/documents\/[^/]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.getByText("e2e-fixture.pdf")).toBeVisible();
  });

  test("V0.3 modules are reachable from the sidebar", async ({ page }) => {
    await page.goto("/today");

    await page.getByRole("link", { name: "Fahrzeuge" }).click();
    await expect(page).toHaveURL(/\/vehicles$/);
    await expect(
      page.getByRole("heading", { name: "Fahrzeuge", level: 1 }),
    ).toBeVisible();

    await page.getByRole("link", { name: "Finanzen" }).click();
    await expect(page).toHaveURL(/\/money$/);

    await page.getByRole("link", { name: "Familie" }).click();
    await expect(page).toHaveURL(/\/family$/);
  });

  test("creates a vehicle", async ({ page }) => {
    const name = `E2E Auto ${Date.now()}`;

    await page.goto("/vehicles/new");
    await page.getByLabel("Name").fill(name);
    await page.getByRole("button", { name: "Fahrzeug anlegen" }).click();

    await expect(page).toHaveURL(/\/vehicles\/[^/]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
  });
});
