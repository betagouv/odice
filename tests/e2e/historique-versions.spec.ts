// Tests E2E de la page d'historique des versions du moteur.

import { expect, test } from "@playwright/test";

test("la page /historique-versions affiche le titre principal", async ({ page }) => {
  await page.goto("/historique-versions");
  await expect(
    page.getByRole("heading", { level: 1, name: /Historique des versions/i }),
  ).toBeVisible();
});

test("la page liste au moins une version du simulateur Abattoirs", async ({ page }) => {
  await page.goto("/historique-versions");
  await expect(page.getByRole("heading", { name: /Simulateur Abattoirs/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Version du /i }).first()).toBeVisible();
});

test("chaque version expose une ancre HTML (deep-link)", async ({ page }) => {
  await page.goto("/historique-versions");
  // Au moins un <article> avec un id ISO YYYY-MM-DD doit être présent
  const article = page.locator("article[id]").first();
  await expect(article).toBeVisible();
  const id = await article.getAttribute("id");
  expect(id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test("chaque version mentionne l'arrêté + sources + changements", async ({ page }) => {
  await page.goto("/historique-versions");
  await expect(page.getByText(/Arrêté :/i).first()).toBeVisible();
  await expect(page.getByText(/Sources :/i).first()).toBeVisible();
  await expect(page.getByText(/Changements :/i).first()).toBeVisible();
});
