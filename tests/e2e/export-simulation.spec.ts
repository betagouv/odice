// Export PDF d'une simulation depuis le panneau de résultats (les deux simulateurs).

import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";

async function exporter(page: Page) {
  const bouton = page.getByRole("button", { name: "Exporter la simulation" });
  await expect(bouton).toBeVisible();
  const [telechargement] = await Promise.all([page.waitForEvent("download"), bouton.click()]);
  const chemin = await telechargement.path();
  const contenu = await readFile(chemin);
  return { nom: telechargement.suggestedFilename(), contenu };
}

test("Abattoir : le bouton télécharge le PDF de la simulation", async ({ page }) => {
  await page.goto("/simulateurs");
  await page.getByLabel(/nature de votre établissement/i).selectOption("abattoir");
  await page.getByLabel(/Zone de votre abattoir/i).selectOption("zone-indemne");
  await page.getByLabel(/Êtes-vous en possession/i).selectOption("oui");
  await page.getByLabel(/Zone d'origine des porcs/i).selectOption("zrii");
  await page.getByLabel(/Statut réglementaire/i).selectOption("mnr-ppa");
  await page.getByLabel(/Zone de l'établissement destinataire/i).selectOption("zone-indemne");
  await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");
  await page.getByRole("button", { name: "Valider" }).click();

  const { nom, contenu } = await exporter(page);
  expect(nom).toMatch(/^odice-simulation-\d{4}-\d{2}-\d{2}\.pdf$/);
  expect(contenu.subarray(0, 5).toString()).toBe("%PDF-");
  expect(contenu.length).toBeGreaterThan(10_000);
});

test("Autres établissements : le bouton télécharge aussi le PDF", async ({ page }) => {
  await page.goto("/simulateurs");
  await page.getByLabel(/nature de votre établissement/i).selectOption("atelier-decoupe");
  await page.getByLabel(/Zone de votre atelier de découpe/i).selectOption("zone-indemne");
  await page.getByLabel(/Êtes-vous en possession/i).selectOption("oui");
  await page.getByLabel(/Zone d'origine des porcs/i).selectOption("zone-indemne");
  await page.locator('label[for="etb-marque-ovale"]').click();
  await page.getByLabel(/Zone de l'établissement destinataire/i).selectOption("zone-indemne");
  await page.getByLabel(/L'établissement destinataire est-il en possession/i).selectOption("oui");
  await page.getByRole("button", { name: "Valider" }).click();

  const { contenu } = await exporter(page);
  expect(contenu.subarray(0, 5).toString()).toBe("%PDF-");
});
