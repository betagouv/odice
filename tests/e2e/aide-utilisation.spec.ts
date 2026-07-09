import { test, expect } from "@playwright/test";

test.describe("Aide à l'utilisation", () => {
  test("la page /aide-utilisation affiche le guide en étapes", async ({ page }) => {
    await page.goto("/aide-utilisation");

    await expect(
      page.getByRole("heading", { level: 1, name: "Aide à l'utilisation" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Comment utiliser le simulateur Odicé/i }),
    ).toBeVisible();

    for (const titre of [
      /1\. Sélectionner votre situation/i,
      /2\. Compléter le formulaire/i,
      /3\. Lire le résultat/i,
      /4\. Lancer une nouvelle simulation/i,
    ]) {
      await expect(page.getByRole("heading", { name: titre })).toBeVisible();
    }

    // Les 5 captures sont référencées (assertion par src, indépendante du chargement du fichier).
    await expect(page.locator('img[src^="/images/image-aide-"]')).toHaveCount(5);
  });

  test("le CTA « Démarrer une simulation » mène aux simulateurs", async ({ page }) => {
    await page.goto("/aide-utilisation");
    await page.getByRole("link", { name: /Démarrer une simulation/i }).click();
    await expect(page).toHaveURL(/\/simulateurs$/);
  });

  test("le menu principal ouvre la page « Aide à l'utilisation »", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Aide à l'utilisation" }).first().click();
    await expect(page).toHaveURL(/\/aide-utilisation$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Aide à l'utilisation" }),
    ).toBeVisible();
  });
});
