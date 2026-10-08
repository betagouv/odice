// Mise en page : accueil (espacements, bouton, image) et espace avant le bandeau d'avertissement.

import { expect, test } from "@playwright/test";

test.describe("Accueil — mise en page", () => {
  test("le titre est proche du menu (marge haute réduite)", async ({ page }) => {
    await page.goto("/");
    const entete = await page.locator("header").boundingBox();
    const titre = await page.getByRole("heading", { level: 1 }).boundingBox();
    expect(entete).not.toBeNull();
    expect(titre).not.toBeNull();
    expect((titre?.y ?? 0) - ((entete?.y ?? 0) + (entete?.height ?? 0))).toBeLessThanOrEqual(40);
  });

  test("« Démarrer une simulation » est placé avant « quel périmètre »", async ({ page }) => {
    await page.goto("/");
    const bouton = await page.getByRole("link", { name: "Démarrer une simulation" }).boundingBox();
    const perimetre = await page
      .getByRole("heading", { name: /pour quels mouvements et quel périmètre/i })
      .boundingBox();
    expect((bouton?.y ?? 0) + (bouton?.height ?? 0)).toBeLessThan(perimetre?.y ?? 0);
  });

  test("la photo occupe la hauteur du bloc « Aide à la décision » à la fin du périmètre", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator("section").first();
    const image = await section.locator("img").boundingBox();
    const titre = await section
      .getByRole("heading", { name: "Aide à la décision pour les professionnels" })
      .boundingBox();
    const dernierPoint = await section.locator("ul li").last().boundingBox();

    expect(Math.abs((image?.y ?? 0) - (titre?.y ?? 0))).toBeLessThanOrEqual(2);
    expect(
      Math.abs(
        (image?.y ?? 0) +
          (image?.height ?? 0) -
          ((dernierPoint?.y ?? 0) + (dernierPoint?.height ?? 0)),
      ),
    ).toBeLessThanOrEqual(2);
  });
});

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
