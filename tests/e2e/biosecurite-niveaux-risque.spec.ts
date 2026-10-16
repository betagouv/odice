import { test, expect } from "@playwright/test";

const URL_FICHE = "/documentation-reglementaire/biosecurite-niveaux-de-risque";

test.describe("Fiche Biosécurité et niveaux de risque", () => {
  test("la page affiche les deux tableaux de niveau de risque", async ({ page }) => {
    await page.goto(URL_FICHE);

    await expect(page).toHaveTitle("Biosécurité et niveaux de risque — Odicé");
    await expect(
      page.getByRole("heading", { level: 1, name: "Biosécurité et niveaux de risque" }),
    ).toBeVisible();

    const tableaux = page.locator(".fr-table table");
    await expect(tableaux).toHaveCount(2);
    // En-tête + 9 niveaux abattoir, en-tête + 17 niveaux viandes.
    await expect(tableaux.nth(0).locator("tr")).toHaveCount(10);
    await expect(tableaux.nth(1).locator("tr")).toHaveCount(18);
    await expect(tableaux.nth(0)).toContainText("Zone réglementée II (ZRII)");
    await expect(tableaux.nth(1)).toContainText("ovale barrée");
  });

  test("les titres et phrases suivent la maquette à jour", async ({ page }) => {
    await page.goto(URL_FICHE);

    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Niveau de risque des porcs dans les abattoirs",
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: "Niveau de risque des viandes dans les établissements du secteur alimentaire",
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "les animaux présentant le niveau de risque le plus élevé sont abattus en dernier",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        /ce dernier récupère le statut de la matière première ayant le niveau de risque le plus élevé/,
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("columnheader", { name: "Niveau de risque des porcs" }),
    ).toBeVisible();
    // Plus aucune trace de l'ancien wording.
    await expect(page.getByText(/plus défavorable|Autres industries|Ordonnancement/)).toHaveCount(
      0,
    );
  });

  test("la colonne « marque sanitaire » est complète dans le tableau des viandes", async ({
    page,
  }) => {
    await page.goto(URL_FICHE);
    const lignes = page.locator(".fr-table table").nth(1).locator("tbody tr");
    await expect(lignes).toHaveCount(17);

    const marques = await lignes.locator("td:nth-child(3)").allInnerTexts();
    expect(marques.every((marque) => marque.trim() !== "")).toBe(true);
    expect(marques[0]).toBe("ovale");
    expect(marques[15]).toBe("ovale barrée");
  });

  test("l'échelle de couleur s'intensifie du premier au dernier niveau", async ({ page }) => {
    await page.goto(URL_FICHE);

    for (const tableau of [0, 1]) {
      const cellules = page
        .locator(".fr-table table")
        .nth(tableau)
        .locator("tbody tr td:first-child");
      // Canal vert du fond réellement affiché (lu via un canvas : Chrome renvoie
      // « color(srgb …) » pour un color-mix, pas « rgb(…) »).
      const vert = await cellules.evaluateAll((tds) =>
        tds.map((td) => {
          const canvas = document.createElement("canvas");
          canvas.width = canvas.height = 1;
          const contexte = canvas.getContext("2d") as CanvasRenderingContext2D;
          contexte.fillStyle = getComputedStyle(td).backgroundColor;
          contexte.fillRect(0, 0, 1, 1);
          return contexte.getImageData(0, 0, 1, 1).data[1];
        }),
      );
      // Plus la ligne est à risque, plus le vert baisse (blanc vers rouge).
      expect(vert[0]).toBe(255);
      expect(vert[vert.length - 1]).toBeLessThan(180);
      for (let i = 1; i < vert.length; i += 1) expect(vert[i]).toBeLessThanOrEqual(vert[i - 1]);
    }
  });

  test("texte noir, zone sur une ligne et titre de colonne coupé avant la parenthèse", async ({
    page,
  }) => {
    await page.goto(URL_FICHE);
    const tableau = page.locator(".fr-table table").nth(1);

    const couleurs = await tableau
      .locator("tbody td")
      .evaluateAll((tds) => [...new Set(tds.map((td) => getComputedStyle(td).color))]);
    expect(couleurs).toEqual(["rgb(0, 0, 0)"]);

    const zone = tableau.locator("tbody tr td:nth-child(2)").first();
    expect(await zone.evaluate((td) => getComputedStyle(td).whiteSpace)).toBe("nowrap");

    const entete = tableau.locator("thead th").nth(3);
    await expect(entete.locator("br")).toHaveCount(1);
    await expect(entete).toContainText("(voir document commercial)");
  });

  test("le plan du site mène à la page", async ({ page }) => {
    await page.goto("/plan-du-site");
    await page.getByRole("link", { name: "Biosécurité et niveaux de risque" }).click();
    await expect(page).toHaveURL(/\/biosecurite-niveaux-de-risque$/);
  });

  test("l'ancienne URL redirige vers la fiche", async ({ page }) => {
    await page.goto("/niveau-de-risque");
    await expect(page).toHaveURL(/\/documentation-reglementaire\/biosecurite-niveaux-de-risque$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Biosécurité et niveaux de risque" }),
    ).toBeVisible();
  });
});
