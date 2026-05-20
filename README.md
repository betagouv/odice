# ODICE — Outil de Décision en contexte PPA

> Outil d'aide à la décision pour les mouvements de viandes (abattoirs et établissements alimentaires) en contexte de Peste Porcine Africaine. Écosystème Beta.gouv.

## Description

ODICE remplace un formulaire Grist par une application web qui calcule, à partir de 5-6 inputs réglementaires (zone d'origine des suidés, statut sanitaire, agrément MCA, etc.), les autorisations applicables aux mouvements de viandes en contexte de Peste Porcine Africaine (PPA).

## Fonctionnalités

- **Simulateur Abattoirs** — pour les abattoirs qui expédient de la viande
- **Simulateur Établissements** — pour les établissements du secteur alimentaire (découpe, transformation, entrepôt) qui réexpédient de la viande déjà en circulation
- **Résultats réglementaires** calculés : marque sanitaire à apposer, territoire autorisé, LPS, certification zoosanitaire, traitement d'atténuation

## Stack technique

| Outil                 | Version |
| --------------------- | ------- |
| React                 | 19      |
| Vite                  | 8       |
| TypeScript (strict)   | 5.7+    |
| DSFR (`@gouvfr/dsfr`) | 1.14    |
| Tailwind CSS          | 4       |
| `react-router-dom`    | 7       |
| `zod`                 | 3       |
| Vitest                | 4       |
| Playwright            | 1.x     |
| ESLint + Prettier     | 9 / 3   |
| pnpm                  | 10      |

## Prérequis

- Node.js **24.x** (voir `.node-version`)
- pnpm **10.x** (déclaré via `packageManager`)

## Installation

```bash
pnpm install
pnpm dev
```

L'application est servie sur <http://localhost:5173>.

## Scripts

| Script              | Description                                                  |
| ------------------- | ------------------------------------------------------------ |
| `pnpm dev`          | Démarre le serveur Vite en mode développement                |
| `pnpm build`        | Génère le build statique (`dist/`)                           |
| `pnpm preview`      | Prévisualise le build généré                                 |
| `pnpm test`         | Lance les tests unitaires Vitest                             |
| `pnpm test:watch`   | Tests unitaires en mode watch                                |
| `pnpm test:e2e`     | Lance les tests E2E Playwright (Chromium)                    |
| `pnpm test:e2e:ui`  | Tests E2E en mode interactif                                 |
| `pnpm lint`         | Lint ESLint                                                  |
| `pnpm lint:fix`     | Lint ESLint avec correction automatique                      |
| `pnpm format`       | Formate avec Prettier                                        |
| `pnpm format:check` | Vérifie le formatage sans modifier                           |
| `pnpm typecheck`    | Vérifie le typage TypeScript                                 |
| `pnpm validate`     | Vérif rapide : format + lint:fix + typecheck + test          |
| `pnpm validate:full` | Vérif complète : `validate` + tests E2E Playwright          |

## Structure du projet

```
odice/
├── .claude/                # Hooks, skills et settings Claude Code
├── .github/                # CI et Dependabot
├── docs/
│   └── adr/                # Architecture Decision Records
├── public/                 # Assets statiques
├── src/
│   ├── engine/             # Moteur de règles TypeScript pur (sans React)
│   │   ├── types.ts        # Inputs / outputs des simulateurs
│   │   ├── rules.ts        # Règles métier PPA
│   │   └── evaluate.ts     # Point d'entrée du moteur
│   ├── features/           # Pages organisées par parcours utilisateur
│   │   ├── home/
│   │   └── simulateurs/    # Sous-domaine simulateurs (composants partagés possibles)
│   │       ├── abattoirs/
│   │       └── etablissements/
│   ├── shared/             # Composants, hooks, utilitaires partagés
│   │   ├── components/
│   │   ├── config/
│   │   ├── hooks/
│   │   └── utils/
│   ├── App.tsx
│   └── main.tsx
├── styles/                 # Styles globaux (Tailwind)
├── tests/
│   ├── e2e/                # Tests Playwright
│   └── fixtures/           # Fixtures partagées
└── ...
```

## Logique métier

Les règles PPA sont implémentées dans [src/engine/rules.ts](src/engine/rules.ts). Le moteur est volontairement isolé de React et testable en pur TypeScript.

Toute modification des règles DOIT être accompagnée :

1. d'un test Vitest couvrant le cas (`src/engine/evaluate.spec.ts`)
2. d'une référence à la source réglementaire (instruction technique, arrêté, etc.) dans un commentaire

## Intégration continue

Le workflow GitHub Actions [`.github/workflows/ci.yml`](.github/workflows/ci.yml) s'exécute :

- À chaque **push** sur n'importe quelle branche
- À chaque **pull request** ciblant `main` ou `dev`

Étapes exécutées (job `ci`, runner Ubuntu) :

1. Setup pnpm + Node.js (version lue depuis `.node-version`, cache pnpm activé)
2. `pnpm install --frozen-lockfile` — installation reproductible depuis le lockfile
3. `pnpm format:check` — vérification du formatage Prettier (sans modification)
4. `pnpm lint` — ESLint
5. `pnpm typecheck` — vérification TypeScript stricte
6. `pnpm test` — tests unitaires Vitest
7. `pnpm exec playwright install --with-deps chromium` — installation du navigateur + libs système
8. `pnpm test:e2e` — tests E2E Playwright (Chromium)
9. **Artefact `playwright-report/`** uploadé en cas d'échec (conservé 7 jours)
10. `pnpm build` — build statique de production

Mises à jour des dépendances : **Dependabot** ([`.github/dependabot.yml`](.github/dependabot.yml)) regroupe les patches/minor en une PR hebdomadaire.

## Déploiement

- Plateforme : **Scalingo**
- Type de build : application statique (`dist/`)
- CI/CD : GitHub Actions (voir section ci-dessus)

## Contribuer

- Workflow Git : branches feature, PR vers `main`
- Vérification obligatoire avant merge : `pnpm validate` doit passer au vert
- Choix architecturaux structurants : documentés par un ADR dans `docs/adr/` (voir skill `/adr`)
- Conventions de code : voir [CLAUDE.md](CLAUDE.md)

## Licence

Voir [LICENSE](LICENSE).
