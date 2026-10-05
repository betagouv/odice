// Tests E2E de la page 404 (route attrape-tout).

import { expect, test } from "@playwright/test";

test("une URL inconnue affiche la page 404 avec un lien vers l'accueil", async ({ page }) => {
  await page.goto("/page-inexistante");
  await expect(page.getByRole("heading", { level: 1, name: "Page non trouvée" })).toBeVisible();
  await expect(page).toHaveTitle(/Page non trouvée/);

  await page.getByRole("link", { name: "Page d'accueil" }).click();
  await expect(page).toHaveURL("/");
});
