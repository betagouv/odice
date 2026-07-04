import { test, expect } from "@playwright/test";

// Remplit le formulaire Autres Établissements avec un cas "tout sain"
// (zone indemne partout, ovale, MCA OUI) → marque ovale, mouvements autorisés.
// En zone d'origine saine, les champs "traitement obligatoire FR/UE" sont masqués
// (cf. traitementFields.ts) : le cas sain ne compte donc que 7 champs visibles.
async function remplirCasSain(page: import("@playwright/test").Page) {
  await page.getByLabel(/Type d'établissement/i).selectOption("atelier-decoupe");
  await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
  await page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i).selectOption("ovale");
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
    await page.getByLabel(/Type d'établissement/i).selectOption("atelier-decoupe");

    await expect(
      page.getByRole("heading", { name: /Mouvement entre établissements/i }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });

  test("Valider reste désactivé tant que les champs requis ne sont pas remplis", async ({
    page,
  }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("atelier-decoupe");

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
    await page.getByLabel(/Type d'établissement/i).selectOption("atelier-decoupe");

    await expect(page.getByLabel(/Zone d'origine des suidés/i)).toBeVisible();
    await expect(page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i)).toHaveCount(
      0,
    );
  });

  test("chaque saisie révèle le champ suivant un par un", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("atelier-decoupe");

    // Zone réglementée : le champ "traitement obligatoire national" s'applique.
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zp");
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

test.describe("Simulateur Autres Établissements — champs traitement conditionnels", () => {
  const frOblig = /traitement d'atténuation est-il obligatoire pour les mouvements nationaux/i;
  const ueOblig = /traitement d'atténuation est-il obligatoire pour les échanges UE/i;

  test("zone d'origine saine : les champs traitement obligatoire ne s'affichent pas", async ({
    page,
  }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("atelier-decoupe");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i).selectOption("ovale");

    await expect(page.getByLabel(frOblig)).toHaveCount(0);
    await expect(page.getByLabel(ueOblig)).toHaveCount(0);
    // Le parcours passe directement à l'établissement expéditeur.
    await expect(
      page.getByLabel(/Zone dans laquelle est localisé l'établissement expéditeur/i),
    ).toBeVisible();
  });

  test("zone réglementée : 'obligatoire UE' masqué si 'obligatoire FR' = oui", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("atelier-decoupe");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zp");
    await page.getByLabel(/Marque sanitaire apposée sur les viandes reçues/i).selectOption("ovale");

    await expect(page.getByLabel(frOblig)).toBeVisible();

    await page.getByLabel(frOblig).selectOption("oui");
    await expect(page.getByLabel(ueOblig)).toHaveCount(0);

    await page.getByLabel(frOblig).selectOption("non");
    await expect(page.getByLabel(ueOblig)).toBeVisible();
  });
});
