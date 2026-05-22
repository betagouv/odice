import { test, expect } from "@playwright/test";

test("la page d'accueil affiche le titre de bienvenue et le CTA Démarrer une simulation", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Bienvenue sur Odicé/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Démarrer une simulation/i })).toBeVisible();
});

test("depuis l'accueil, le CTA Démarrer une simulation mène à la page de choix des simulateurs", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Démarrer une simulation/i }).click();
  await expect(page).toHaveURL(/\/simulateurs$/);
});

test("le simulateur Abattoirs est accessible directement via son URL", async ({ page }) => {
  await page.goto("/simulateurs/abattoirs");
  await expect(
    page.getByRole("heading", { level: 1, name: /Simulateur Abattoirs/i }),
  ).toBeVisible();
});

test("le simulateur Établissements est accessible directement via son URL", async ({ page }) => {
  await page.goto("/simulateurs/etablissements");
  await expect(
    page.getByRole("heading", { level: 1, name: /Simulateur Établissements/i }),
  ).toBeVisible();
});

test("la navigation principale mène à la documentation réglementaire", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Documentation réglementaire", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: /Documentation réglementaire/i }),
  ).toBeVisible();
});
