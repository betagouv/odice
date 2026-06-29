import { test, expect } from "@playwright/test";

// Remplit les 9 champs du formulaire Autres Établissements avec un cas "tout sain"
// (zone indemne partout, ovale, MCA OUI) → marque ovale, mouvements autorisés.
async function remplirCasSain(page: import("@playwright/test").Page) {
  await page.getByLabel(/Type d'établissement/i).selectOption("autre");
  await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
  await page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i).selectOption("ovale");
  await page
    .getByLabel(/traitement d'atténuation est-il obligatoire pour les mouvements nationaux/i)
    .selectOption("non");
  await page
    .getByLabel(/traitement d'atténuation est-il obligatoire pour les échanges UE/i)
    .selectOption("non");
  await page
    .getByLabel(/Zone dans laquelle est localisé l'établissement expéditeur/i)
    .selectOption("zone-indemne");
  await page.getByLabel(/L'établissement expéditeur est-il en possession/i).selectOption("oui");
  await page.getByLabel(/traitement d'atténuation a-t-il été réalisé/i).selectOption("non");
  await page
    .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
    .selectOption("zone-indemne");
  await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");
}

test.describe("Simulateur Autres Établissements", () => {
  test("sélectionner 'Autre établissement' affiche le formulaire dédié", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("autre");

    await expect(
      page.getByRole("heading", { name: /Mouvement entre établissements/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });

  test("Valider reste désactivé tant que les 9 champs ne sont pas remplis", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("autre");

    const valider = page.getByRole("button", { name: "Valider" });
    await expect(valider).toBeDisabled();

    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await expect(valider).toBeDisabled();
  });

  test("cas zone indemne / ovale / MCA → marque ovale et mouvements autorisés", async ({
    page,
  }) => {
    await page.goto("/simulateurs");
    await remplirCasSain(page);
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).toBeVisible();
    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();
    await expect(page.getByText("MOUVEMENT AUTORISÉ").first()).toBeVisible();
  });

  test("modifier un champ après Valider masque le panneau de résultats", async ({ page }) => {
    await page.goto("/simulateurs");
    await remplirCasSain(page);
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).toBeVisible();

    await page
      .getByLabel(/Marque sanitaire apposée sur les viandes reçues/i)
      .selectOption("ovale-barree");
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });
});

test.describe("Simulateur Autres Établissements — affichage progressif", () => {
  test("au démarrage, seul le premier champ est visible", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("autre");

    await expect(page.getByLabel(/Zone d'origine des suidés/i)).toBeVisible();
    await expect(page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i)).toHaveCount(
      0,
    );
  });

  test("chaque saisie révèle le champ suivant un par un", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("autre");

    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await expect(page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i)).toBeVisible();
    await expect(
      page.getByLabel(/traitement d'atténuation est-il obligatoire pour les mouvements nationaux/i),
    ).toHaveCount(0);

    await page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i).selectOption("ovale");
    await expect(
      page.getByLabel(/traitement d'atténuation est-il obligatoire pour les mouvements nationaux/i),
    ).toBeVisible();
  });

  test("Réinitialiser vide les champs mais les garde visibles", async ({ page }) => {
    await page.goto("/simulateurs");
    await remplirCasSain(page);

    await page.getByRole("button", { name: "Réinitialiser" }).click();

    await expect(page.getByLabel(/Zone d'origine des suidés/i)).toHaveValue("");
    await expect(page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i)).toBeVisible();
    await expect(page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i)).toHaveValue(
      "",
    );
    await expect(
      page.getByLabel(/L'établissement destinataire est-il en possession/i),
    ).toBeVisible();
  });
});
