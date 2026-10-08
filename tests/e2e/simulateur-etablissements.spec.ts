// Tests E2E du simulateur Autres Établissements.
// Couvre : libellés adaptés au type, affichage progressif, champs traitement
// conditionnels, validation, reset.

import { test, expect, type Page } from "@playwright/test";

// Libellés des champs, centralisés pour absorber les évolutions de wording.
const L = {
  type: /nature de votre établissement/i,
  zoneEtb: /Zone de votre atelier de découpe/i,
  mcaEtb: /Êtes-vous en possession/i,
  zoneSuides: /Zone d'origine des porcs/i,
  marque: /Marque sanitaire présente sur les viandes/i,
  traitementFr: /traitement d'atténuation est-il obligatoire pour les mouvements nationaux/i,
  traitementUe: /traitement d'atténuation est-il obligatoire pour les échanges UE/i,
  traitementRealise: /traitement d'atténuation a-t-il été réalisé/i,
  zoneDest: /Zone de l'établissement destinataire/i,
  mcaDest: /L'établissement destinataire est-il en possession/i,
};

const SECTION_ETB = /Informations sur votre atelier de découpe/i;

async function ouvrirAtelier(page: Page) {
  await page.goto("/simulateurs");
  await page.getByLabel(L.type).selectOption("atelier-decoupe");
}

// DSFR masque l'input radio : on clique sur son libellé, comme un utilisateur.
async function choisirMarque(page: Page, marque: string) {
  await page.locator(`label[for="etb-marque-${marque}"]`).click();
}

// Remplit l'établissement puis la zone d'origine des porcs.
async function remplirJusquaSuides(page: Page, zoneSuides: string) {
  await page.getByLabel(L.zoneEtb).selectOption("zone-indemne");
  await page.getByLabel(L.mcaEtb).selectOption("oui");
  await page.getByLabel(L.zoneSuides).selectOption(zoneSuides);
}

// Cas "tout sain" (zone indemne partout, ovale, MCA oui) → marque ovale, mouvements autorisés.
// Zone saine + ovale : aucune question de traitement (valeurs connues, spec M1).
async function remplirCasSain(page: Page) {
  await remplirJusquaSuides(page, "zone-indemne");
  await choisirMarque(page, "ovale");
  await page.getByLabel(L.zoneDest).selectOption("zone-indemne");
  await page.getByLabel(L.mcaDest).selectOption("oui");
}

test.describe("Simulateur Autres Établissements", () => {
  test("sélectionner un atelier de découpe affiche le formulaire dédié", async ({ page }) => {
    await ouvrirAtelier(page);

    await expect(page.getByRole("heading", { name: SECTION_ETB })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });

  test("les libellés reprennent le type d'établissement choisi", async ({ page }) => {
    await ouvrirAtelier(page);
    await page.getByLabel(L.type).selectOption("entrepot");

    await expect(
      page.getByRole("heading", { name: /Informations sur votre entrepôt/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/Zone de votre entrepôt/i)).toBeVisible();
  });

  test("Valider reste désactivé tant que les champs requis ne sont pas remplis", async ({
    page,
  }) => {
    await ouvrirAtelier(page);

    const valider = page.getByRole("button", { name: "Valider" });
    await expect(valider).toBeDisabled();

    await remplirJusquaSuides(page, "zone-indemne");
    await expect(valider).toBeDisabled();
  });

  test("cas zone indemne / ovale / MCA → marque ovale et mouvements autorisés", async ({
    page,
  }) => {
    await ouvrirAtelier(page);
    await remplirCasSain(page);
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).toBeVisible();
    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();
    await expect(page.getByText("MOUVEMENT AUTORISÉ").first()).toBeVisible();

    // Mentions : zone d'origine seule (pas de statut ici, pas de traitement exigé).
    const mentions = page.locator(".fr-alert--info");
    await expect(mentions).toContainText("Zone indemne");
    await expect(mentions).not.toContainText("Traitement d'atténuation");
    await expect(mentions).not.toContainText("Statut du mouvement");
  });

  test("modifier un champ après Valider masque le panneau de résultats", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirCasSain(page);
    await page.getByRole("button", { name: "Valider" }).click();
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).toBeVisible();

    await choisirMarque(page, "ovale-barree");
    await expect(page.getByRole("heading", { name: /Conditions de mouvement/i })).not.toBeVisible();
  });

  test("les deux questions MCA portent l'infobulle MCA", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirCasSain(page);

    const tooltip = page.locator('[role="tooltip"]').filter({ hasText: /Maladie de catégorie A/i });
    await expect(tooltip).toHaveCount(2);
  });
});

test.describe("Simulateur Autres Établissements — affichage progressif", () => {
  test("au démarrage, seule la section établissement est visible, en entier", async ({ page }) => {
    await ouvrirAtelier(page);

    await expect(page.getByLabel(L.zoneEtb)).toBeVisible();
    await expect(page.getByLabel(L.mcaEtb)).toBeVisible();
    await expect(page.getByLabel(L.zoneSuides)).toHaveCount(0);
  });

  test("la provenance se dévoile en trois temps : zone, puis marque, puis traitements", async ({
    page,
  }) => {
    await ouvrirAtelier(page);
    await page.getByLabel(L.zoneEtb).selectOption("zone-indemne");
    await page.getByLabel(L.mcaEtb).selectOption("oui");

    // Étape 1 : la zone d'origine seule.
    await expect(page.getByLabel(L.zoneSuides)).toBeVisible();
    await expect(page.getByRole("group", { name: L.marque })).toHaveCount(0);
    await expect(page.getByLabel(L.traitementFr)).toHaveCount(0);

    // Étape 2 : la marque apparaît une fois la zone choisie.
    await page.getByLabel(L.zoneSuides).selectOption("zriii");
    await expect(page.getByRole("group", { name: L.marque })).toBeVisible();
    await expect(page.getByLabel(L.traitementFr)).toHaveCount(0);
    await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);

    // Étape 3 : les questions de traitement apparaissent une fois la marque choisie.
    await choisirMarque(page, "ovale-diagonales-paralleles");
    await expect(page.getByLabel(L.traitementFr)).toBeVisible();
    await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);
  });

  test("sans question de traitement, la destination suit directement la marque", async ({
    page,
  }) => {
    await ouvrirAtelier(page);
    await remplirJusquaSuides(page, "zone-indemne");
    await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);

    await choisirMarque(page, "ovale");
    await expect(page.getByLabel(L.zoneDest)).toBeVisible();
  });

  test("chaque section complète révèle la suivante en entier", async ({ page }) => {
    await ouvrirAtelier(page);

    await remplirJusquaSuides(page, "zriii");
    await expect(page.getByRole("group", { name: L.marque })).toBeVisible();
    await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);

    // ZRIII à diagonales : traitement national demandé, puis réalisé s'il est obligatoire.
    await choisirMarque(page, "ovale-diagonales-paralleles");
    await page.getByLabel(L.traitementFr).selectOption("oui");
    await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);
    await page.getByLabel(L.traitementRealise).selectOption("non");

    // Destination : zone et MCA du destinataire apparaissent ensemble.
    await expect(page.getByLabel(L.zoneDest)).toBeVisible();
    await expect(page.getByLabel(L.mcaDest)).toBeVisible();
  });

  test("Réinitialiser vide les champs mais les garde visibles", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirCasSain(page);

    await page.getByRole("button", { name: "Réinitialiser" }).click();

    await expect(page.locator("#etb-marque-ovale")).not.toBeChecked();
    await expect(page.getByLabel(L.zoneEtb)).toHaveValue("");
    await expect(page.getByLabel(L.zoneSuides)).toBeVisible();
    await expect(page.getByLabel(L.zoneSuides)).toHaveValue("");
    await expect(page.getByLabel(L.mcaDest)).toBeVisible();
  });
});

test.describe("Simulateur Autres Établissements — champs traitement conditionnels", () => {
  test("la question « obligatoire pour les échanges UE » n'existe plus", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirJusquaSuides(page, "zriii");
    await choisirMarque(page, "ovale-barree");
    await expect(page.getByLabel(L.traitementFr)).toBeVisible();
    await expect(page.getByLabel(L.traitementUe)).toHaveCount(0);
  });

  for (const zone of ["zone-indemne", "zp", "zrii"]) {
    test(`${zone} + ovale : aucune question de traitement, destination directe`, async ({
      page,
    }) => {
      await ouvrirAtelier(page);
      await remplirJusquaSuides(page, zone);
      await choisirMarque(page, "ovale");

      await expect(page.getByLabel(L.traitementFr)).toHaveCount(0);
      await expect(page.getByLabel(L.traitementRealise)).toHaveCount(0);
      await expect(page.getByLabel(L.zoneDest)).toBeVisible();
    });
  }

  test("ovale barrée hors ZRIII : seule la question « réalisé »", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirJusquaSuides(page, "zrii");
    await choisirMarque(page, "ovale-barree");

    await expect(page.getByLabel(L.traitementFr)).toHaveCount(0);
    await expect(page.getByLabel(L.traitementRealise)).toBeVisible();
  });

  test("ZRIII à diagonales : « réalisé » seulement si le national est obligatoire", async ({
    page,
  }) => {
    await ouvrirAtelier(page);
    await remplirJusquaSuides(page, "zriii");
    await choisirMarque(page, "ovale-diagonales-paralleles");

    await page.getByLabel(L.traitementFr).selectOption("non");
    await expect(page.getByLabel(L.traitementRealise)).toHaveCount(0);
    await expect(page.getByLabel(L.zoneDest)).toBeVisible();

    await page.getByLabel(L.traitementFr).selectOption("oui");
    await expect(page.getByLabel(L.traitementRealise)).toBeVisible();
  });

  test("ZRII + ovale barrée traitée → la viande ressort en ovale", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirJusquaSuides(page, "zrii");
    await choisirMarque(page, "ovale-barree");
    await page.getByLabel(L.traitementRealise).selectOption("oui");
    await page.getByLabel(L.zoneDest).selectOption("zone-indemne");
    await page.getByLabel(L.mcaDest).selectOption("oui");
    await page.getByRole("button", { name: "Valider" }).click();

    await expect(page.getByText("OVALE", { exact: true })).toBeVisible();
    await expect(page.getByText("MOUVEMENT AUTORISÉ")).toHaveCount(2);
  });
});

test.describe("Simulateur Autres Établissements — ZI FS réflexe", () => {
  test("proposée dans les trois listes de zones", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirCasSain(page);

    for (const id of ["#etb-zone-exp", "#etb-zone-suides", "#etb-zone-dest"]) {
      await expect(page.locator(`${id} option[value="zi-fs-reflexe"]`)).toHaveCount(1);
    }
  });

  test("porcs en ZI FS réflexe : situation impossible, validation bloquée", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirJusquaSuides(page, "zi-fs-reflexe");

    await expect(page.getByRole("alert")).toContainText(
      "Situation impossible : les mouvements de porcs provenant de ZI FS réflexe sont interdits.",
    );
    await choisirMarque(page, "ovale");
    await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Valider" })).toBeDisabled();
  });
});

test.describe("Simulateur Autres Établissements — situations impossibles", () => {
  for (const [zone, marque] of [
    ["zone-indemne", "ovale-barree"],
    ["zri", "ovale-diagonales-paralleles"],
  ]) {
    test(`${zone} + ${marque} : mélange de lot, validation bloquée`, async ({ page }) => {
      await ouvrirAtelier(page);
      await remplirJusquaSuides(page, zone);
      await choisirMarque(page, marque);

      await expect(page.getByRole("alert")).toContainText(
        "Situation impossible : vérifier qu'il n'y ait pas de mélange de lot.",
      );
      await expect(page.getByLabel(L.traitementRealise)).toHaveCount(0);
      await expect(page.getByLabel(L.zoneDest)).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Valider" })).toBeDisabled();
    });
  }

  test("corriger la marque lève l'alerte et révèle la destination", async ({ page }) => {
    await ouvrirAtelier(page);
    await remplirJusquaSuides(page, "zone-indemne");
    await choisirMarque(page, "ovale-barree");
    await expect(page.getByRole("alert")).toBeVisible();

    await choisirMarque(page, "ovale");
    await expect(page.getByRole("alert")).toHaveCount(0);
    await expect(page.getByLabel(L.zoneDest)).toBeVisible();
  });
});

test.describe("Simulateur Autres Établissements — tableau des mélanges", () => {
  test("« référez-vous à ce tableau » ouvre le niveau de risque dans un nouvel onglet", async ({
    page,
    context,
  }) => {
    await ouvrirAtelier(page);
    await remplirJusquaSuides(page, "zone-indemne");

    const lien = page.getByRole("link", { name: "référez-vous à ce tableau" });
    await expect(lien).toHaveAttribute("href", "/niveau-de-risque");
    await expect(lien).toHaveAttribute("target", "_blank");

    const [onglet] = await Promise.all([context.waitForEvent("page"), lien.click()]);
    await expect(
      onglet.getByRole("heading", { level: 1, name: "Niveau de risque des porcs et des viandes" }),
    ).toBeVisible();
  });
});
