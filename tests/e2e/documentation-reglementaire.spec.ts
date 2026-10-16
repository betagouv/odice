import { test, expect } from "@playwright/test";

const FICHES = [
  "Zones réglementées",
  "Marques d'identification ou de salubrité",
  "Traitement d'atténuation",
  "Biosécurité et niveaux de risque",
  "Agrément zoosanitaire MCA",
  "Documents d'accompagnement",
  "Corpus réglementaire",
  "Glossaire",
];

test.describe("Documentation réglementaire", () => {
  test("l'accueil affiche les 8 fiches dans l'ordre de la maquette", async ({ page }) => {
    await page.goto("/documentation-reglementaire");

    await expect(page).toHaveTitle("Documentation réglementaire — Odicé");
    const titres = page.locator(".fr-card__title");
    await expect(titres).toHaveText(FICHES);
    await expect(page.locator(".fr-notice")).toContainText("Avertissement");
  });

  for (const fiche of FICHES) {
    test(`la carte « ${fiche} » mène à sa fiche, affichée depuis le haut`, async ({ page }) => {
      await page.goto("/documentation-reglementaire");
      // Accueil défilé : la fiche ne doit pas hériter de cette position.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.locator(".fr-card__title").getByRole("link", { name: fiche }).click();

      await expect(page.getByRole("heading", { level: 1, name: fiche })).toBeInViewport();
      expect(await page.evaluate(() => window.scrollY)).toBe(0);
      await expect(page).toHaveTitle(`${fiche} — Odicé`);
      await expect(
        page.locator(".fr-breadcrumb").getByRole("link", { name: "Documentation réglementaire" }),
      ).toHaveAttribute("href", "/documentation-reglementaire");
    });
  }

  test("le menu reste actif sur une fiche", async ({ page }) => {
    await page.goto("/documentation-reglementaire/glossaire");
    await expect(
      page.locator(".fr-nav").getByRole("link", { name: "Documentation réglementaire" }),
    ).toHaveAttribute("aria-current", "page");
  });

  test("le menu ouvre la documentation dans un nouvel onglet", async ({ page }) => {
    await page.goto("/simulateurs");
    const lien = page.locator(".fr-nav").getByRole("link", { name: "Documentation réglementaire" });
    await expect(lien).toHaveAttribute("target", "_blank");
    const [onglet] = await Promise.all([page.waitForEvent("popup"), lien.click()]);
    await expect(onglet).toHaveURL(/\/documentation-reglementaire$/);
    await expect(page).toHaveURL(/\/simulateurs$/);
  });

  test("chaque carte affiche son visuel", async ({ page }) => {
    await page.goto("/documentation-reglementaire");
    const images = page.locator(".fr-card__img img");
    await expect(images).toHaveCount(8);
    for (const image of await images.all()) {
      await expect(image).toHaveJSProperty("complete", true);
      expect(await image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
  });

  test("le corpus présente trois accordéons, tous fermés", async ({ page }) => {
    await page.goto("/documentation-reglementaire/corpus-reglementaire");
    const reglements = page.getByRole("button", { name: "Règlements européens" });
    const arretes = page.getByRole("button", { name: "Arrêtés ministériels" });
    const instructions = page.getByRole("button", { name: "Instructions techniques" });
    for (const bouton of [reglements, arretes, instructions]) {
      await expect(bouton).toHaveAttribute("aria-expanded", "false");
    }
    await expect(
      page.getByRole("heading", { level: 3, name: "Règlement (UE) 2016/429" }),
    ).toBeHidden();
    await reglements.click();

    // 8 règlements + 3 arrêtés + 8 instructions, tous en nouvel onglet.
    const liens = page.locator(".fr-accordion a");
    await expect(liens).toHaveCount(19);
    for (const lien of await liens.all()) await expect(lien).toHaveAttribute("target", "_blank");
    await expect(page.locator(".fr-accordion a[href*='eur-lex.europa.eu']")).toHaveCount(8);
    await expect(page.locator(".fr-accordion a[href*='legifrance.gouv.fr']")).toHaveCount(3);

    await arretes.click();
    await expect(arretes).toHaveAttribute("aria-expanded", "true");
    await expect(
      page.getByRole("heading", { level: 3, name: "Arrêté du 24 avril 2024" }),
    ).toBeVisible();
    // Accordéons indépendants : ouvrir le deuxième ne referme pas le premier.
    await expect(reglements).toHaveAttribute("aria-expanded", "true");

    await reglements.click();
    await expect(reglements).toHaveAttribute("aria-expanded", "false");
    await expect(
      page.getByRole("heading", { level: 3, name: "Règlement (UE) 2016/429" }),
    ).toBeHidden();
  });

  test("les documents d'accompagnement présentent LPS et certificat", async ({ page }) => {
    await page.goto("/documentation-reglementaire/documents-accompagnement");
    await expect(
      page.getByRole("heading", { level: 2, name: "Laissez-passer sanitaire" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Le certificat zoosanitaire" }),
    ).toBeVisible();
    await expect(page.locator(".fr-callout li")).toHaveCount(2);
  });

  test("la fiche zones présente les deux schémas d'évolution", async ({ page }) => {
    await page.goto("/documentation-reglementaire/zones-reglementees");
    await expect(page.getByRole("heading", { level: 3, name: "Foyer en élevage" })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 3, name: "Cas en faune sauvage" }),
    ).toBeVisible();
    // Images décoratives chargées, décrites textuellement pour les lecteurs d'écran.
    const schemas = page.locator("figure img[src*='/images/documentation/zones-']");
    await expect(schemas).toHaveCount(2);
    for (const schema of await schemas.all()) {
      await schema.scrollIntoViewIfNeeded();
      await expect(schema).toHaveJSProperty("complete", true);
      expect(await schema.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
    }
    await expect(page.getByRole("list", { name: "Avec nouveau foyer" })).toContainText("J +30");
    await expect(page.getByRole("list", { name: "Sans nouveau cas" })).toContainText("J +365");
  });

  test("le glossaire liste 19 termes et 7 zones sanitaires", async ({ page }) => {
    await page.goto("/documentation-reglementaire/glossaire");
    // 19 termes + le titre « Zones sanitaires ».
    await expect(page.locator("main h2")).toHaveCount(20);
    await expect(page.getByRole("heading", { level: 2, name: "Zones sanitaires" })).toBeVisible();
    await expect(page.locator("main h3")).toHaveCount(7);
    await expect(
      page.getByRole("heading", { level: 2, name: "Marque ovale barrée" }),
    ).toBeVisible();
  });

  test("les marques affichent leur visuel", async ({ page }) => {
    await page.goto("/documentation-reglementaire/marques-identification-salubrite");
    await expect(page.getByRole("img", { name: /^Marque / })).toHaveCount(3);
  });
});
