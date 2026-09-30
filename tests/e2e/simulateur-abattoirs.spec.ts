// Tests E2E du simulateur Abattoirs.
// Couvre : sélection du type, formulaire, statut conditionnel, validation,
// cas connus (cf. tests/fixtures/abattoirs/oracle-2744.json), reset, retour
// au placeholder après modification.

import { expect, test, type Page } from "@playwright/test";

// Libellés des champs, centralisés pour absorber les évolutions de wording.
const L = {
  type: /nature de votre établissement/i,
  zoneAbattoir: /Zone de votre abattoir/i,
  mcaAbattoir: /Êtes-vous en possession/i,
  zoneSuides: /Zone d'origine des porcs/i,
  statut: /Statut réglementaire/i,
  zoneDest: /Zone de l'établissement destinataire/i,
  mcaDest: /L'établissement destinataire est-il en possession/i,
};

const SECTION_ABATTOIR = /Informations sur votre abattoir/i;

type Saisie = {
  zoneAbattoir: string;
  mcaAbattoir: "oui" | "non";
  zoneSuides: string;
  statut?: string;
  zoneDest: string;
  mcaDest: "oui" | "non";
};

const CAS_SAIN: Saisie = {
  zoneAbattoir: "zone-indemne",
  mcaAbattoir: "oui",
  zoneSuides: "zone-indemne",
  zoneDest: "zone-indemne",
  mcaDest: "oui",
};

async function ouvrirAbattoir(page: Page) {
  await page.goto("/simulateurs");
  await page.getByLabel(L.type).selectOption("abattoir");
}

// Remplit les champs dans l'ordre d'affichage progressif.
async function remplir(page: Page, saisie: Saisie) {
  await page.getByLabel(L.zoneAbattoir).selectOption(saisie.zoneAbattoir);
  await page.getByLabel(L.mcaAbattoir).selectOption(saisie.mcaAbattoir);
  await page.getByLabel(L.zoneSuides).selectOption(saisie.zoneSuides);
  if (saisie.statut !== undefined) await page.getByLabel(L.statut).selectOption(saisie.statut);
  await page.getByLabel(L.zoneDest).selectOption(saisie.zoneDest);
  await page.getByLabel(L.mcaDest).selectOption(saisie.mcaDest);
}

// Remplit jusqu'à la zone d'origine des porcs incluse.
async function remplirJusquaSuides(page: Page, zoneSuides: string) {
  await page.getByLabel(L.zoneAbattoir).selectOption("zone-indemne");
  await page.getByLabel(L.mcaAbattoir).selectOption("oui");
  await page.getByLabel(L.zoneSuides).selectOption(zoneSuides);
}

test.describe("Simulateur Abattoirs — chargement initial", () => {
  test("la page /simulateurs affiche la carte 'Votre situation'", async ({ page }) => {
    await page.goto("/simulateurs");
    await expect(page.getByRole("heading", { name: "Votre situation" })).toBeVisible();
    await expect(page.getByLabel(L.type)).toBeVisible();
  });

  test("aucun formulaire ni résultat tant que le type n'est pas sélectionné", async ({ page }) => {
    await page.goto("/simulateurs");
    await expect(page.getByRole("heading", { name: SECTION_ABATTOIR })).not.toBeVisible();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });

  test("sélectionner 'Abattoir' fait apparaître le formulaire mais pas encore le panneau de résultats", async ({
    page,
  }) => {
    await ouvrirAbattoir(page);
    await expect(page.getByRole("heading", { name: SECTION_ABATTOIR })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — champ statut conditionnel", () => {
  test("statut masqué pour zone indemne", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplirJusquaSuides(page, "zone-indemne");
    await expect(page.getByLabel(L.statut)).toHaveCount(0);
  });

  test("statut visible et requis pour ZRII", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplirJusquaSuides(page, "zrii");
    await expect(page.getByLabel(L.statut)).toBeVisible();
    await expect(page.getByLabel(L.statut)).toBeEnabled();
  });

  test("statut re-masqué en revenant sur zone indemne", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplirJusquaSuides(page, "zrii");
    await expect(page.getByLabel(L.statut)).toBeVisible();

    await page.getByLabel(L.zoneSuides).selectOption("zone-indemne");
    await expect(page.getByLabel(L.statut)).toHaveCount(0);
  });
});

test.describe("Simulateur Abattoirs — bouton Valider", () => {
  test("Valider désactivé tant que le formulaire est incomplet", async ({ page }) => {
    await ouvrirAbattoir(page);
    const validerBtn = page.getByRole("button", { name: "Valider" });
    await expect(validerBtn).toBeDisabled();

    await page.getByLabel(L.zoneAbattoir).selectOption("zone-indemne");
    await expect(validerBtn).toBeDisabled();

    await page.getByLabel(L.mcaAbattoir).selectOption("oui");
    await page.getByLabel(L.zoneSuides).selectOption("zone-indemne");
    await page.getByLabel(L.zoneDest).selectOption("zone-indemne");
    await expect(validerBtn).toBeDisabled();

    await page.getByLabel(L.mcaDest).selectOption("oui");
    await expect(validerBtn).toBeEnabled();
  });

  test("Valider reste désactivé tant que statut est requis mais non rempli (ZRII)", async ({
    page,
  }) => {
    await ouvrirAbattoir(page);
    await remplirJusquaSuides(page, "zrii");

    // En ZRII, le statut s'insère dans la séquence : tant qu'il n'est pas rempli,
    // les champs suivants ne sont pas révélés et Valider reste désactivé.
    const validerBtn = page.getByRole("button", { name: "Valider" });
    await expect(page.getByLabel(L.statut)).toBeVisible();
    await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);
    await expect(validerBtn).toBeDisabled();

    await page.getByLabel(L.statut).selectOption("mr-ppa");
    await page.getByLabel(L.zoneDest).selectOption("zone-indemne");
    await page.getByLabel(L.mcaDest).selectOption("oui");
    await expect(validerBtn).toBeEnabled();
  });
});

test.describe("Simulateur Abattoirs — résultats sur cas connus", () => {
  test("Zone indemne + MCA partout → ovale, autorisé FR + UE", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, CAS_SAIN);
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText(/Cliquez sur valider/i)).not.toBeVisible();
    await expect(page.getByText("MOUVEMENT AUTORISÉ").first()).toBeVisible();
    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();
    await expect(page.getByText("NON OBLIGATOIRE").first()).toBeVisible();
    await expect(page.getByText("LPS NON REQUIS")).toBeVisible();
    await expect(page.getByText("CERTIFICATION ZOOSANITAIRE NON REQUISE")).toBeVisible();
  });

  test("ZP + abattoir non MCA → AUCUNE MARQUE, mouvement interdit FR + UE", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, { ...CAS_SAIN, zoneSuides: "zp", mcaAbattoir: "non" });
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("AUCUNE MARQUE")).toBeVisible();
    await expect(page.getByText("MOUVEMENT INTERDIT").first()).toBeVisible();
    // 4 badges « NON APPLICABLE » (traitement FR+UE + document FR+UE)
    await expect(page.getByText("NON APPLICABLE").first()).toBeVisible();
  });

  test("ZRIII MNR-PPA + MCA + dest non MCA → diagonales parallèles, FR autorisé UE interdit", async ({
    page,
  }) => {
    await ouvrirAbattoir(page);
    await remplir(page, { ...CAS_SAIN, zoneSuides: "zriii", statut: "mnr-ppa", mcaDest: "non" });
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("OVALE DIAGONALES PARALLÈLES")).toBeVisible();
    await expect(page.getByText("MOUVEMENT AUTORISÉ")).toBeVisible();
    await expect(page.getByText("MOUVEMENT INTERDIT")).toBeVisible();
    await expect(page.getByText("LPS SYSTÉMATIQUE")).toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — abattoir en ZI FS réflexe", () => {
  test("donne le même résultat qu'un abattoir en ZI FS", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, { ...CAS_SAIN, zoneAbattoir: "zi-fs" });
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("CERTIFICATION ZOOSANITAIRE OBLIGATOIRE")).toBeVisible();
    const attendu = await page.locator(".fr-badge").allInnerTexts();
    expect(attendu.length).toBeGreaterThan(0);

    await page.getByLabel(L.zoneAbattoir).selectOption("zi-fs-reflexe");
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("CERTIFICATION ZOOSANITAIRE OBLIGATOIRE")).toBeVisible();
    expect(await page.locator(".fr-badge").allInnerTexts()).toEqual(attendu);
  });
});

test.describe("Simulateur Abattoirs — porcs en ZI FS réflexe", () => {
  test("donne le même résultat que des porcs en ZI FS, sans demander le statut", async ({
    page,
  }) => {
    await ouvrirAbattoir(page);
    await remplir(page, { ...CAS_SAIN, zoneSuides: "zi-fs", mcaDest: "non" });
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("OVALE DIAGONALES PARALLÈLES")).toBeVisible();
    const attendu = await page.locator(".fr-badge").allInnerTexts();

    await page.getByLabel(L.zoneSuides).selectOption("zi-fs-reflexe");
    await expect(page.getByLabel(L.statut)).toHaveCount(0);
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("OVALE DIAGONALES PARALLÈLES")).toBeVisible();
    expect(await page.locator(".fr-badge").allInnerTexts()).toEqual(attendu);
  });
});

test.describe("Simulateur Abattoirs — interactions post-validation", () => {
  test("modifier un champ après Valider masque le panneau de résultats", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, CAS_SAIN);
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();

    await page.getByLabel(L.zoneSuides).selectOption("zp");

    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
    await expect(page.getByText("OVALE", { exact: true })).not.toBeVisible();
  });

  test("Réinitialiser vide le formulaire et masque le panneau de résultats", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, CAS_SAIN);
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Réinitialiser" }).click();

    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
    await expect(page.getByLabel(L.zoneAbattoir)).toHaveValue("");
    await expect(page.getByRole("button", { name: "Valider" })).toBeDisabled();
  });

  test("changer de type d'établissement remplace le formulaire affiché", async ({ page }) => {
    await ouvrirAbattoir(page);
    await expect(page.getByRole("heading", { name: SECTION_ABATTOIR })).toBeVisible();

    await page.getByLabel(L.type).selectOption("atelier-decoupe");
    await expect(page.getByRole("heading", { name: SECTION_ABATTOIR })).not.toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Mouvement entre établissements/i }),
    ).toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — affichage progressif", () => {
  test("au démarrage, seul le premier champ est visible", async ({ page }) => {
    await ouvrirAbattoir(page);

    await expect(page.getByLabel(L.zoneAbattoir)).toBeVisible();
    await expect(page.getByLabel(L.mcaAbattoir)).toHaveCount(0);
    await expect(page.getByLabel(L.zoneSuides)).toHaveCount(0);
  });

  test("chaque saisie révèle le champ suivant un par un", async ({ page }) => {
    await ouvrirAbattoir(page);

    await page.getByLabel(L.zoneAbattoir).selectOption("zone-indemne");
    await expect(page.getByLabel(L.mcaAbattoir)).toBeVisible();
    // Le champ d'après n'apparaît pas encore.
    await expect(page.getByLabel(L.zoneSuides)).toHaveCount(0);

    await page.getByLabel(L.mcaAbattoir).selectOption("oui");
    await expect(page.getByLabel(L.zoneSuides)).toBeVisible();
  });

  test("modifier une valeur ne masque pas les champs déjà révélés", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, CAS_SAIN);

    // Changer la zone d'origine des porcs (vers une zone sans statut) ne masque aucun autre champ.
    await page.getByLabel(L.zoneSuides).selectOption("zp");

    await expect(page.getByLabel(L.zoneAbattoir)).toHaveValue("zone-indemne");
    await expect(page.getByLabel(L.mcaDest)).toHaveValue("oui");
  });

  test("Réinitialiser vide les champs mais les garde visibles", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, CAS_SAIN);

    await page.getByRole("button", { name: "Réinitialiser" }).click();

    // Les champs restent affichés, vidés de leur valeur.
    await expect(page.getByLabel(L.zoneAbattoir)).toHaveValue("");
    await expect(page.getByLabel(L.zoneSuides)).toBeVisible();
    await expect(page.getByLabel(L.zoneSuides)).toHaveValue("");
    await expect(page.getByLabel(L.mcaDest)).toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — infobulles", () => {
  test("la question MCA de l'abattoir porte l'infobulle MCA", async ({ page }) => {
    await ouvrirAbattoir(page);
    await page.getByLabel(L.zoneAbattoir).selectOption("zone-indemne");

    const tooltip = page.locator('[role="tooltip"]').filter({ hasText: /Maladie de catégorie A/i });
    await expect(tooltip).toHaveCount(1);
  });

  test("la question MCA du destinataire porte aussi l'infobulle MCA", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, CAS_SAIN);

    const tooltip = page.locator('[role="tooltip"]').filter({ hasText: /Maladie de catégorie A/i });
    await expect(tooltip).toHaveCount(2);
  });

  test("l'infobulle du statut définit MR-PPA et MNR-PPA", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplirJusquaSuides(page, "zrii");

    const tooltip = page.locator('[role="tooltip"]').filter({ hasText: /MR-PPA =/ });
    await expect(tooltip).toContainText("MNR-PPA =");
  });
});

test.describe("Simulateur Abattoirs — lien vers l'historique des versions", () => {
  test("la date du résultat ouvre l'historique dans un nouvel onglet", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, CAS_SAIN);
    await page.getByRole("button", { name: "Valider" }).click();

    // Sélecteur par href plutôt que par texte (le label contient des accents).
    const dateLink = page.locator('a[href*="/historique-versions#"]');
    await expect(dateLink).toBeVisible();
    await expect(dateLink).toHaveAttribute("target", "_blank");
  });
});
