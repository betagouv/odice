// Boutons « ? » des simulateurs : liens vers la fiche de documentation, en nouvel onglet.

import { test, expect, type Page } from "@playwright/test";

const DOC = "/documentation-reglementaire";
const ZONES = `${DOC}/zones-reglementees`;
const MCA = `${DOC}/agrement-zoosanitaire-mca`;

// Lien « ? » rattaché au libellé d'un champ (label ou légende de groupe).
function lienDuChamp(page: Page, idLibelle: string) {
  return page.locator(
    `label[for="${idLibelle}"] a.fr-btn--tooltip, #${idLibelle} a.fr-btn--tooltip`,
  );
}

async function verifierLiens(page: Page, attendus: Record<string, string>) {
  for (const [champ, href] of Object.entries(attendus)) {
    const lien = lienDuChamp(page, champ);
    await expect(lien, champ).toHaveAttribute("href", href);
    await expect(lien, champ).toHaveAttribute("target", "_blank");
  }
}

// Répond à chaque liste déroulante visible restée vide, jusqu'à ce que le champ attendu apparaisse.
async function remplirJusqua(page: Page, idCible: string) {
  for (let tour = 0; tour < 10 && (await page.locator(`#${idCible}`).count()) === 0; tour += 1) {
    for (const select of await page.locator("main form select").all()) {
      if ((await select.inputValue()) === "") await select.selectOption({ index: 1 });
    }
  }
}

test.describe("Liens des simulateurs vers la documentation", () => {
  test("Abattoirs : chaque « ? » mène à sa fiche", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/nature de votre établissement/i).selectOption("abattoir");
    await page.getByLabel(/Zone de votre abattoir/i).selectOption("zone-indemne");
    await page.getByLabel(/Êtes-vous en possession/i).selectOption("oui");
    // Le statut n'est demandé que pour des porcs issus de ZRII / ZRIII.
    await page.getByLabel(/Zone d'origine des porcs/i).selectOption("zriii");
    await remplirJusqua(page, "mca-dest");

    await verifierLiens(page, {
      "zone-abattoir": ZONES,
      "mca-abattoir": MCA,
      "zone-suides": ZONES,
      statut: `${DOC}/glossaire#mnr-ppa`,
      "zone-dest": ZONES,
      "mca-dest": MCA,
    });
  });

  test("Établissements : chaque « ? » mène à sa fiche", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/nature de votre établissement/i).selectOption("atelier-decoupe");
    await page.getByLabel(/Zone de votre atelier de découpe/i).selectOption("zone-indemne");
    await page.getByLabel(/Êtes-vous en possession/i).selectOption("oui");
    await page.getByLabel(/Zone d'origine des porcs/i).selectOption("zriii");
    await page.locator('label[for="etb-marque-ovale-diagonales-paralleles"]').click();
    await remplirJusqua(page, "etb-mca-dest");

    await verifierLiens(page, {
      "etb-zone-exp": ZONES,
      "etb-mca-exp": MCA,
      "etb-zone-suides": ZONES,
      "etb-marque-viandes-legend": `${DOC}/marques-identification-salubrite`,
      "etb-trait-oblig-fr": `${DOC}/traitement-attenuation`,
      "etb-zone-dest": ZONES,
      "etb-mca-dest": MCA,
    });
  });

  test("Établissements : la question « réalisé », même seule, mène à la fiche traitement", async ({
    page,
  }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/nature de votre établissement/i).selectOption("atelier-decoupe");
    await page.getByLabel(/Zone de votre atelier de découpe/i).selectOption("zone-indemne");
    await page.getByLabel(/Êtes-vous en possession/i).selectOption("oui");
    await page.getByLabel(/Zone d'origine des porcs/i).selectOption("zrii");
    await page.locator('label[for="etb-marque-ovale-barree"]').click();

    await expect(page.locator("#etb-trait-oblig-fr")).toHaveCount(0);
    await verifierLiens(page, { "etb-trait-realise": `${DOC}/traitement-attenuation` });
  });

  test("le clic ouvre la fiche dans un nouvel onglet sans quitter la saisie", async ({ page }) => {
    await page.goto("/simulateurs");
    await page.getByLabel(/nature de votre établissement/i).selectOption("abattoir");
    const zone = page.getByLabel(/Zone de votre abattoir/i);
    await zone.selectOption("zone-indemne");

    const [onglet] = await Promise.all([
      page.waitForEvent("popup"),
      page.getByRole("link", { name: /Consulter la fiche « Zones réglementées »/ }).click(),
    ]);
    await expect(
      onglet.getByRole("heading", { level: 1, name: "Zones réglementées" }),
    ).toBeVisible();
    await expect(zone).toHaveValue("zone-indemne");
    // Pas de bulle DSFR à activer : le « ? » est un simple lien.
    await expect(page.locator(".fr-tooltip")).toHaveCount(0);
  });

  test("le lien du statut amène au terme MNR-PPA du glossaire", async ({ page }) => {
    await page.goto(`${DOC}/glossaire#mnr-ppa`);
    const terme = page.getByRole("heading", { level: 2, name: "MNR-PPA" });
    await expect(terme).toBeInViewport();
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });
});
