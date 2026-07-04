// Tests E2E du simulateur Abattoirs.
// Couvre : carte de sélection, formulaire, statut conditionnel, validation,
// cas connus (cf. tests/fixtures/abattoirs/oracle-2744.json), reset, retour
// au placeholder après modification.

import { expect, test } from "@playwright/test";

test.describe("Simulateur Abattoirs — chargement initial", () => {
  test("la page /simulateurs affiche la carte 'Votre situation'", async ({ page }) => {
    await page.goto("/simulateurs");
    await expect(page.getByRole("heading", { name: "Votre situation" })).toBeVisible();
    await expect(page.getByLabel(/Type d'établissement/i)).toBeVisible();
  });

  test("aucun formulaire ni résultat tant que le type n'est pas sélectionné", async ({ page }) => {
    await page.goto("/simulateurs");
    await expect(page.getByRole("heading", { name: /Mouvement abattoir/i })).not.toBeVisible();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });

  test("sélectionner 'Abattoir' fait apparaître le formulaire mais pas encore le panneau de résultats", async ({
    page,
  }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");

    await expect(page.getByRole("heading", { name: /Mouvement abattoir/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — champ statut conditionnel", () => {
  test("statut masqué pour zone indemne", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");

    await expect(page.getByLabel(/Statut réglementaire/i)).toHaveCount(0);
  });

  test("statut visible et requis pour ZRII", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zrii");

    await expect(page.getByLabel(/Statut réglementaire/i)).toBeVisible();
    await expect(page.getByLabel(/Statut réglementaire/i)).toBeEnabled();
  });

  test("statut re-masqué en revenant sur zone indemne", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zrii");
    await expect(page.getByLabel(/Statut réglementaire/i)).toBeVisible();

    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await expect(page.getByLabel(/Statut réglementaire/i)).toHaveCount(0);
  });
});

test.describe("Simulateur Abattoirs — bouton Valider", () => {
  test("Valider désactivé tant que le formulaire est incomplet", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");

    const validerBtn = page.getByRole("button", { name: "Valider" });
    await expect(validerBtn).toBeDisabled();

    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await expect(validerBtn).toBeDisabled();

    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");

    await expect(validerBtn).toBeEnabled();
  });

  test("Valider reste désactivé tant que statut est requis mais non rempli (ZRII)", async ({
    page,
  }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zrii");

    // En ZRII, le statut s'insère dans la séquence : tant qu'il n'est pas rempli,
    // les champs suivants ne sont pas révélés et Valider reste désactivé.
    const validerBtn = page.getByRole("button", { name: "Valider" });
    await expect(page.getByLabel(/Statut réglementaire/i)).toBeVisible();
    await expect(page.getByLabel(/Zone dans laquelle est localisé votre abattoir/i)).toHaveCount(0);
    await expect(validerBtn).toBeDisabled();

    await page.getByLabel(/Statut réglementaire/i).selectOption("mr-ppa");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");

    await expect(validerBtn).toBeEnabled();
  });
});

test.describe("Simulateur Abattoirs — résultats sur cas connus", () => {
  test("Zone indemne + MCA partout → ovale, autorisé FR + UE", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");

    await page.getByRole("button", { name: "Valider" }).click();

    // Le panneau ne montre plus le placeholder mais les badges
    await expect(page.getByText(/Cliquez sur valider/i)).not.toBeVisible();
    await expect(page.getByText("MOUVEMENT AUTORISÉ").first()).toBeVisible();
    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();
    await expect(page.getByText("NON OBLIGATOIRE").first()).toBeVisible();
    await expect(page.getByText("LPS NON REQUIS")).toBeVisible();
    await expect(page.getByText("CERTIFICATION ZOOSANITAIRE NON REQUISE")).toBeVisible();
  });

  test("ZP + abattoir non MCA → AUCUNE MARQUE, mouvement interdit FR + UE", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zp");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("non");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");

    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("AUCUNE MARQUE")).toBeVisible();
    await expect(page.getByText("MOUVEMENT INTERDIT").first()).toBeVisible();
    // 4 badges « NON APPLICABLE » (traitement FR+UE + document FR+UE)
    await expect(page.getByText("NON APPLICABLE").first()).toBeVisible();
  });

  test("ZRIII MNR-PPA + MCA + dest non MCA → diagonales parallèles, FR autorisé UE interdit", async ({
    page,
  }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zriii");
    await page.getByLabel(/Statut réglementaire/i).selectOption("mnr-ppa");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("non");

    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("OVALE DIAGONALES PARALLÈLES")).toBeVisible();
    await expect(page.getByText("MOUVEMENT AUTORISÉ")).toBeVisible();
    await expect(page.getByText("MOUVEMENT INTERDIT")).toBeVisible();
    await expect(page.getByText("LPS SYSTÉMATIQUE")).toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — interactions post-validation", () => {
  test("modifier un champ après Valider masque le panneau de résultats", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();

    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zp");

    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
    await expect(page.getByText("OVALE", { exact: true })).not.toBeVisible();
  });

  test("Réinitialiser vide le formulaire et masque le panneau de résultats", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Réinitialiser" }).click();

    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
    await expect(page.getByLabel(/Zone d'origine des suidés/i)).toHaveValue("");
    await expect(page.getByRole("button", { name: "Valider" })).toBeDisabled();
  });

  test("changer de type d'établissement remplace le formulaire affiché", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await expect(page.getByRole("heading", { name: /Mouvement abattoir/i })).toBeVisible();

    await page.getByLabel(/Type d'établissement/i).selectOption("atelier-decoupe");
    await expect(page.getByRole("heading", { name: /Mouvement abattoir/i })).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Mouvement entre établissements/i }),
    ).toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — affichage progressif", () => {
  test("au démarrage, seul le premier champ est visible", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");

    await expect(page.getByLabel(/Zone d'origine des suidés/i)).toBeVisible();
    await expect(page.getByLabel(/Zone dans laquelle est localisé votre abattoir/i)).toHaveCount(0);
    await expect(page.getByLabel(/Votre abattoir est-il en possession/i)).toHaveCount(0);
  });

  test("chaque saisie révèle le champ suivant un par un", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");

    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await expect(page.getByLabel(/Zone dans laquelle est localisé votre abattoir/i)).toBeVisible();
    // Le champ d'après n'apparaît pas encore.
    await expect(page.getByLabel(/Votre abattoir est-il en possession/i)).toHaveCount(0);

    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await expect(page.getByLabel(/Votre abattoir est-il en possession/i)).toBeVisible();
  });

  test("modifier une valeur ne masque pas les champs déjà révélés", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");

    // Changer la zone des suidés (vers une zone sans statut) ne masque aucun autre champ.
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zp");

    await expect(page.getByLabel(/Zone dans laquelle est localisé votre abattoir/i)).toHaveValue(
      "zone-indemne",
    );
    await expect(page.getByLabel(/L'établissement destinataire est-il en possession/i)).toHaveValue(
      "oui",
    );
  });

  test("Réinitialiser vide les champs mais les garde visibles", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");

    await page.getByRole("button", { name: "Réinitialiser" }).click();

    // Les champs restent affichés, vidés de leur valeur.
    await expect(page.getByLabel(/Zone d'origine des suidés/i)).toHaveValue("");
    await expect(page.getByLabel(/Zone dans laquelle est localisé votre abattoir/i)).toBeVisible();
    await expect(page.getByLabel(/Zone dans laquelle est localisé votre abattoir/i)).toHaveValue(
      "",
    );
    await expect(
      page.getByLabel(/L'établissement destinataire est-il en possession/i),
    ).toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — lien vers l'historique des versions", () => {
  test("la date du résultat ouvre l'historique dans un nouvel onglet", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");
    await page.getByRole("button", { name: "Valider" }).click();

    // Sélecteur par href plutôt que par texte (le label contient des accents).
    const dateLink = page.locator('a[href*="/historique-versions#"]');
    await expect(dateLink).toBeVisible();
    await expect(dateLink).toHaveAttribute("target", "_blank");
  });
});
