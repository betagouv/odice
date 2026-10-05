import { test, expect } from "@playwright/test";

test("la page d'accueil affiche le titre de bienvenue et le CTA Démarrer une simulation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Accueil — Odice");
  await expect(page.getByRole("heading", { name: /Bienvenue sur Odice/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Démarrer une simulation/i })).toBeVisible();
});

test("le titre de l'onglet change selon la page (navigation /simulateurs)", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("Accueil — Odice");

  await page.goto("/simulateurs");
  await expect(page).toHaveTitle("Simulateur — Odice");

  await page.goto("/historique-versions");
  await expect(page).toHaveTitle("Historique des versions — Odice");
});

test("depuis l'accueil, le CTA Démarrer une simulation mène à la page des simulateurs", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Démarrer une simulation/i }).click();
  await expect(page).toHaveURL(/\/simulateurs$/);
  await expect(page.getByRole("heading", { name: /Votre situation/i })).toBeVisible();
});
