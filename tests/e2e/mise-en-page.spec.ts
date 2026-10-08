// Mise en page : accueil (espacements, bouton, image) et espace avant le bandeau d'avertissement.

import { expect, test } from "@playwright/test";

test.describe("Espace avant le bandeau d'avertissement", () => {
  for (const [nom, chemin] of [
    ["accueil", "/"],
    ["simulateurs", "/simulateurs"],
    ["niveau de risque", "/niveau-de-risque"],
  ]) {
    test(`${nom} : au moins 100 px entre le contenu et le bandeau`, async ({ page }) => {
      await page.goto(chemin);
      const resultat = await page.evaluate(() => {
        const bandeau = document.querySelector(".fr-notice");
        const precedent = bandeau?.previousElementSibling ?? null;
        return {
          adjacent: precedent !== null,
          paddingBas: precedent ? parseFloat(getComputedStyle(precedent).paddingBottom) : 0,
        };
      });
      // Le bloc de contenu touche le bandeau : son padding bas est donc l'espace visible.
      expect(resultat.adjacent).toBe(true);
      expect(resultat.paddingBas).toBeGreaterThanOrEqual(100);
    });
  }
});
