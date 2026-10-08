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
    await expect(page.getByText("NON-OBLIGATOIRE").first()).toBeVisible();
    await expect(page.getByText("LAISSEZ-PASSER SANITAIRE NON REQUIS")).toBeVisible();
    await expect(page.getByText("CERTIFICAT ZOOSANITAIRE NON REQUIS")).toBeVisible();
  });

  test("ZP + abattoir non MCA → FR interdit : seule la possibilité de mouvement s'affiche", async ({
    page,
  }) => {
    await ouvrirAbattoir(page);
    await remplir(page, { ...CAS_SAIN, zoneSuides: "zp", mcaAbattoir: "non" });
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("MOUVEMENT INTERDIT")).toHaveCount(2);
    await expect(page.getByRole("heading", { name: /Marque à apposer/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Traitement d'atténuation/i })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Document d'accompagnement/i })).toHaveCount(0);
    await expect(page.locator(".fr-alert--info")).toHaveCount(0);
  });

  test("ZP + MCA partout → ovale barrée, UE interdit sans traitement d'atténuation", async ({
    page,
  }) => {
    await ouvrirAbattoir(page);
    await remplir(page, { ...CAS_SAIN, zoneSuides: "zp" });
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("OVALE BARRÉE")).toBeVisible();
    await expect(page.locator('img[src="/images/marques/ovale-barree.png"]')).toBeVisible();
    await expect(page.getByText("MOUVEMENT INTERDIT SANS TRAITEMENT D'ATTÉNUATION")).toBeVisible();
    await expect(page.getByText("LAISSEZ-PASSER SANITAIRE PERMANENT")).toBeVisible();

    const mentions = page.locator(".fr-alert--info");
    await expect(mentions).toContainText("Mentions à reporter sur les documents commerciaux");
    await expect(mentions).toContainText("Zone de protection");
    await expect(mentions).toContainText(
      "Traitement d'atténuation obligatoire pour une mise sur le marché sur le territoire national et pour les échanges intracommunautaires",
    );
    // Zone ZP : pas de statut demandé, donc pas de ligne statut.
    await expect(mentions).not.toContainText("Statut du mouvement");
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
    await expect(page.getByText("LAISSEZ-PASSER SANITAIRE SYSTÉMATIQUE")).toBeVisible();
    await expect(page.locator(".fr-alert--info")).toContainText(
      "Statut du mouvement des animaux dont sont issues les viandes : MNR-PPA",
    );
    // UE interdit : plus de ligne UE dans le traitement ni dans les documents.
    await expect(page.getByText("UE", { exact: true })).toHaveCount(1);
  });
});

test.describe("Simulateur Abattoirs — abattoir en ZI FS réflexe", () => {
  test("donne le même résultat qu'un abattoir en ZI FS", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, { ...CAS_SAIN, zoneAbattoir: "zi-fs" });
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("CERTIFICAT ZOOSANITAIRE", { exact: true })).toBeVisible();
    const attendu = await page.locator(".fr-badge").allInnerTexts();
    expect(attendu.length).toBeGreaterThan(0);

    await page.getByLabel(L.zoneAbattoir).selectOption("zi-fs-reflexe");
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("CERTIFICAT ZOOSANITAIRE", { exact: true })).toBeVisible();
    expect(await page.locator(".fr-badge").allInnerTexts()).toEqual(attendu);
  });
});

test.describe("Simulateur Abattoirs — destinataire en ZI FS réflexe", () => {
  test("donne le même résultat qu'un destinataire en ZI FS", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplir(page, {
      ...CAS_SAIN,
      zoneSuides: "zrii",
      statut: "mr-ppa",
      zoneDest: "zi-fs",
      mcaDest: "non",
    });
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByText("OVALE DIAGONALES PARALLÈLES")).toBeVisible();
    const attendu = await page.locator(".fr-badge").allInnerTexts();

    await page.getByLabel(L.zoneDest).selectOption("zi-fs-reflexe");
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("OVALE DIAGONALES PARALLÈLES")).toBeVisible();
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

  test("le bandeau des mentions reprend « Zone infectée faune sauvage réflexe »", async ({
    page,
  }) => {
    await ouvrirAbattoir(page);
    await remplir(page, { ...CAS_SAIN, zoneSuides: "zi-fs-reflexe", mcaDest: "non" });
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("MOUVEMENT AUTORISÉ").first()).toBeVisible();
    const mentions = page.locator(".fr-alert--info");
    await expect(mentions).toContainText(
      "Zone de provenance des animaux dont sont issues les viandes : Zone infectée faune sauvage réflexe",
    );

    // Même saisie en ZI FS : « réflexe » disparaît du bandeau.
    await page.getByLabel(L.zoneSuides).selectOption("zi-fs");
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(mentions).toContainText("Zone infectée faune sauvage");
    await expect(mentions).not.toContainText("réflexe");
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
      page.getByRole("heading", { name: /Informations sur votre atelier de découpe/i }),
    ).toBeVisible();
  });
});

test.describe("Simulateur Abattoirs — affichage progressif", () => {
  test("au démarrage, seule la section abattoir est visible, en entier", async ({ page }) => {
    await ouvrirAbattoir(page);

    await expect(page.getByLabel(L.zoneAbattoir)).toBeVisible();
    await expect(page.getByLabel(L.mcaAbattoir)).toBeVisible();
    await expect(page.getByLabel(L.zoneSuides)).toHaveCount(0);
  });

  test("chaque section complète révèle la suivante en entier", async ({ page }) => {
    await ouvrirAbattoir(page);

    // Section abattoir incomplète : la provenance n'apparaît pas encore.
    await page.getByLabel(L.zoneAbattoir).selectOption("zone-indemne");
    await expect(page.getByLabel(L.zoneSuides)).toHaveCount(0);

    await page.getByLabel(L.mcaAbattoir).selectOption("oui");
    await expect(page.getByLabel(L.zoneSuides)).toBeVisible();
    await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);

    // Destination : zone et MCA du destinataire apparaissent ensemble.
    await page.getByLabel(L.zoneSuides).selectOption("zone-indemne");
    await expect(page.getByLabel(L.zoneDest)).toBeVisible();
    await expect(page.getByLabel(L.mcaDest)).toBeVisible();
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

  test("l'infobulle du statut explique MR-PPA et MNR-PPA", async ({ page }) => {
    await ouvrirAbattoir(page);
    await remplirJusquaSuides(page, "zrii");

    const tooltip = page
      .locator('[role="tooltip"]')
      .filter({ hasText: /MR-PPA — Mouvement respectant/ });
    await expect(tooltip).toContainText("MNR-PPA — Mouvement ne respectant pas");
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
