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

  test("sélectionner 'Abattoir' fait apparaître le formulaire et le panneau placeholder", async ({
    page,
  }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");

    await expect(page.getByRole("heading", { name: /Mouvement abattoir/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).toBeVisible();
    await expect(page.getByText(/Cliquez sur valider/i)).toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — champ statut conditionnel", () => {
  test("statut désactivé pour zone indemne", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");

    await expect(page.getByLabel(/Statut réglementaire/i)).toBeDisabled();
  });

  test("statut activé et requis pour ZRII", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zrii");

    await expect(page.getByLabel(/Statut réglementaire/i)).toBeEnabled();
  });

  test("statut re-désactivé en revenant sur zone indemne", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zrii");
    await expect(page.getByLabel(/Statut réglementaire/i)).toBeEnabled();

    await page.getByLabel(/Zone d'origine des suidés/i).selectOption("zone-indemne");
    await expect(page.getByLabel(/Statut réglementaire/i)).toBeDisabled();
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
    await page
      .getByLabel(/Zone dans laquelle est localisé votre abattoir/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/Votre abattoir est-il en possession/i).selectOption("oui");
    await page
      .getByLabel(/Zone dans laquelle est localisé l'établissement destinataire/i)
      .selectOption("zone-indemne");
    await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");

    const validerBtn = page.getByRole("button", { name: "Valider" });
    await expect(validerBtn).toBeDisabled();

    await page.getByLabel(/Statut réglementaire/i).selectOption("mr-ppa");
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
  test("modifier un champ après Valider remet le panneau en placeholder", async ({ page }) => {
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

    await expect(page.getByText(/Cliquez sur valider/i)).toBeVisible();
    await expect(page.getByText("OVALE", { exact: true })).not.toBeVisible();
  });

  test("Réinitialiser vide le formulaire et le panneau revient au placeholder", async ({
    page,
  }) => {
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

    await expect(page.getByText(/Cliquez sur valider/i)).toBeVisible();
    await expect(page.getByLabel(/Zone d'origine des suidés/i)).toHaveValue("");
    await expect(page.getByRole("button", { name: "Valider" })).toBeDisabled();
  });

  test("changement de type d'établissement masque le simulateur", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/Type d'établissement/i).selectOption("abattoir");
    await expect(page.getByRole("heading", { name: /Mouvement abattoir/i })).toBeVisible();

    await page.getByLabel(/Type d'établissement/i).selectOption("autre");
    await expect(page.getByRole("heading", { name: /Mouvement abattoir/i })).not.toBeVisible();
    await expect(page.getByText(/en cours de développement/i)).toBeVisible();
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
