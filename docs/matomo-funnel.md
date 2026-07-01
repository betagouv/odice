# Mesure d'audience Matomo — funnel du parcours simulateur

ODICE envoie à Matomo une page vue à chaque navigation et des événements le long du parcours simulateur. Ce document décrit le funnel à créer côté Matomo. L'intégration technique est décrite dans [ADR-0007](./adr/0007-analytics-matomo-wrapper-maison.md).

## Événements émis

Tous les événements portent la **catégorie** `Simulateur PPA` et un **nom** (`abattoir` ou `autre`) selon le simulateur. Source : [`src/shared/analytics/events.ts`](../src/shared/analytics/events.ts), émis depuis [`src/features/simulateurs/pages/SimulateursIndexPage.tsx`](../src/features/simulateurs/pages/SimulateursIndexPage.tsx).

| Action | Déclencheur |
|---|---|
| `simulateur_ouvert` | Choix d'un type d'établissement |
| `simulation_lancee` | Soumission valide du formulaire |
| `resultat_affiche` | Résultat calculé et affiché |
| `reinitialisation` | Clic sur le bouton « Réinitialiser » (et non sur une simple saisie) |

Rappel : le tracking n'est actif **qu'en build production** et seulement si `VITE_MATOMO_URL` + `VITE_MATOMO_SITE_ID` sont renseignés (cf. [`.env.example`](../.env.example)).

## Prérequis

Le suivi de funnel nécessite le plugin **Funnels** de Matomo (inclus sur Matomo Cloud, installable sur instance auto-hébergée). Menu : **Objectifs → Funnels → Gérer les funnels**.

## Funnel « Parcours simulateur ODICE » (4 étapes)

| # | Étape | Correspondance | Valeur |
|---|---|---|---|
| 1 | Page simulateur | URL contient | `/simulateurs` |
| 2 | Simulateur ouvert | Événement — Action | `simulateur_ouvert` |
| 3 | Simulation lancée | Événement — Action | `simulation_lancee` |
| 4 | Résultat affiché | Événement — Action | `resultat_affiche` |

- Pour chaque étape « Événement », ajouter la condition **Catégorie = `Simulateur PPA`** afin d'éviter toute collision future.
- Laisser le funnel en mode **non strict** : les étapes se suivent dans l'ordre naturel, inutile d'interdire les sauts.

## Découpage par type de simulateur

Les événements portent un `name` (`abattoir` / `autre`). Approche recommandée : **un seul funnel + segment**.

- Créer le funnel une fois, puis l'analyser avec un segment `Event Name == abattoir`, puis `Event Name == autre`.
- Alternative (plus de maintenance) : deux funnels distincts, chaque étape Événement filtrant aussi sur `Nom == abattoir` (resp. `autre`).

## Points d'attention

- **Étape 3 → 4 ≈ 100 %.** L'évaluation est synchrone et n'échoue jamais côté utilisateur : un écart `simulation_lancee → resultat_affiche` signale une **erreur JS** (captée par l'ErrorBoundary), pas un abandon. Pour un funnel purement comportemental, on peut fusionner les étapes 3 et 4 en une seule « Simulation aboutie » sur `resultat_affiche`.
- **`reinitialisation` n'est pas une étape de funnel** (c'est une friction, pas une progression). La créer comme **Objectif** séparé (Événement Action = `reinitialisation`) pour mesurer le taux de remise à zéro.
- Les points d'abandon réellement utiles à observer sont **1 → 2** (arrivée sans choix de type) et **2 → 3** (formulaire ouvert mais non soumis = formulaire trop long ou complexe).

## `VITE_MATOMO_FUNNEL_ID`

La variable est lue et validée par le module mais **pas encore consommée** par le code. Une fois le funnel créé, Matomo lui attribue un ID : le poser dans cette variable n'est utile que si l'on souhaite plus tard référencer le funnel côté code (API Funnels, tracking explicite). Pour un funnel défini entièrement dans l'UI Matomo, ce n'est pas nécessaire.
