import { test, expect } from "@playwright/test";

test.describe("Niveau de risque des porcs et des viandes", () => {
  test("la page affiche les deux tableaux de niveau de risque", async ({ page }) => {
    await page.goto("/niveau-de-risque");

    await expect(page).toHaveTitle("Niveau de risque des porcs et des viandes — Odicé");
    await expect(
      page.getByRole("heading", { level: 1, name: "Niveau de risque des porcs et des viandes" }),
    ).toBeVisible();

    const tableaux = page.locator(".fr-table table");
    await expect(tableaux).toHaveCount(2);
    // En-tête + 9 niveaux abattoir, en-tête + 17 niveaux viandes.
    await expect(tableaux.nth(0).locator("tr")).toHaveCount(10);
    await expect(tableaux.nth(1).locator("tr")).toHaveCount(18);
    await expect(tableaux.nth(0)).toContainText("Zone réglementée II (ZRII)");
    await expect(tableaux.nth(1)).toContainText("ovale barrée");
  });

  test("le plan du site mène à la page", async ({ page }) => {
    await page.goto("/plan-du-site");
    await page.getByRole("link", { name: "Niveau de risque des porcs et des viandes" }).click();
    await expect(page).toHaveURL(/\/niveau-de-risque$/);
  });
});
