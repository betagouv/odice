# ODICE - Instructions pour Claude Code

## Description du projet

ODICE (Outil de Décision pour les mouvements de viandes en contexte de Peste Porcine Africaine) est une application web Beta.gouv qui remplace un formulaire Grist. Elle propose deux simulateurs (Abattoirs et Autres Établissements) prenant 5-6 inputs et produisant 5-6 résultats réglementaires : marque sanitaire à apposer, territoire autorisé, LPS, certification zoosanitaire, traitement d'atténuation.

Projet Beta.gouv / gouvernement français.

## Stack technique

- **UI** : React 19 + Vite 8 (TypeScript strict)
- **Design System** : DSFR (`@gouvfr/dsfr`) en CSS+JS direct
- **CSS utilitaire** : Tailwind CSS 4 (`@tailwindcss/postcss`)
- **Routing** : `react-router-dom` 7
- **Validation** : `zod`
- **Tests unitaires** : Vitest + `@testing-library/react` + `jsdom`
- **Tests E2E** : Playwright (Chromium)
- **Package Manager** : pnpm (OBLIGATOIRE, jamais npm ou yarn)
- **Lint/Format** : ESLint 9 flat config + Prettier 3

## Règles de code STRICTES

### 1. TypeScript - Typage explicite obligatoire

```typescript
// INTERDIT - génère @typescript-eslint/no-unsafe-assignment
const result = someApiCall();
const value = result.data;

// OBLIGATOIRE - cast explicite
const result = someApiCall() as ApiResponse<MyData>;
const value = result.data as MyData;
```

- TOUJOURS typer les paramètres et retours de fonction exportée
- TOUJOURS utiliser `as Type` lors d'assignations depuis `any` ou `unknown`
- JAMAIS utiliser `any` sans cast explicite
- TOUJOURS importer les types nécessaires

### 2. Pas d'emojis/icônes dans le code

```typescript
// INTERDIT
console.log(`Simulateur ouvert`);

// CORRECT
console.log(`Simulateur ouvert`);
```

Pas d'emoji dans `console.log`, dans les commentaires, dans les chaînes affichées à l'utilisateur. Pour l'iconographie, utiliser les icônes DSFR (`.fr-icon-*`).

### 3. Accents français OBLIGATOIRES

Le code et les commentaires doivent respecter l'orthographe française avec tous les accents appropriés :

```typescript
// INTERDIT - accents manquants
const message = "Donnees recuperees avec succes";
// Configuration des etapes du simulateur

// OBLIGATOIRE - accents corrects
const message = "Données récupérées avec succès";
// Configuration des étapes du simulateur
```

**Accents courants à respecter :**

- **é** : données, récupéré, étape, créé, sélectionner, résultat, contrôlé, atténuation
- **è** : critère, accès, précédent, problème, système, règle
- **ê** : être, fenêtre, requête
- **à** : à (préposition), déjà, voilà
- **ô** : contrôle, bientôt, côté
- **ç** : français, façon, reçu
- **î** : maîtrise, connaître

Cette règle s'applique à :

- Tous les textes affichés à l'utilisateur (labels, messages, boutons)
- Les commentaires dans le code
- Les messages d'erreur
- Les tooltips et placeholders

### 4. Conventions de nommage

- Composants React : `PascalCase` (ex. `SimulatorForm.tsx`, `ResultPanel.tsx`)
- Pages : `*Page.tsx` (ex. `HomePage.tsx`, `SimulateurAbattoirsPage.tsx`)
- Services : `*.service.ts`
- DTOs / types partagés : `*.dto.ts` ou `*.types.ts`
- Tests : `*.spec.ts` / `*.spec.tsx`
- Hooks personnalisés : `use*.ts`

### 5. Commentaires : simples et brefs

Les commentaires doivent être **courts** et n'expliquer que le **pourquoi** (jamais le quoi évident).

```typescript
// INTERDIT - verbeux, paraphrase le code, multi-lignes inutiles
/**
 * Cette fonction prend en entrée les inputs du simulateur Abattoirs
 * et applique successivement toutes les règles métier PPA définies
 * dans la spécification DOCX du 2026-05-12 pour produire en sortie
 * un objet contenant les 7 sorties attendues du moteur.
 */
export function evaluateAbattoir(inputs: AbattoirsInputs): AbattoirsOutputs { ... }

// CORRECT - bref, va à l'essentiel
// Orchestre les 5 règles. Spec : docs/sources/abattoirs-formules-20260512.docx
export function evaluateAbattoir(inputs: AbattoirsInputs): AbattoirsOutputs { ... }
```

Règles :

- Pas de commentaires qui paraphrasent le code (le code est déjà lisible).
- Pas de docblocks JSDoc longs sauf si la fonction a une sémantique non évidente.
- Un commentaire d'une ligne suffit dans 90 % des cas.
- Préférer un nom de variable/fonction explicite à un commentaire d'explication.
- Référencer la source réglementaire (chemin de fichier) en une ligne, pas en paragraphe.

### 6. CSS : DSFR + Tailwind, pas de CSS custom

Pour toute UI, **ordre de priorité strict** :

1. **DSFR** (dernière version, **`@gouvfr/dsfr` 1.14+`** à date) — classes `fr-*`, composants documentés sur [systeme-de-design.gouv.fr](https://www.systeme-de-design.gouv.fr/). C'est le défaut absolu pour layout, formulaires, boutons, badges, alertes, etc.
2. **Tailwind CSS** (v4) — uniquement pour les ajustements utilitaires que le DSFR ne couvre pas (espacements fins, grille spécifique, responsive ponctuel).
3. **CSS custom** (fichier `.css` dédié ou inline) — **uniquement** si DSFR + Tailwind ne suffisent pas, et **après avoir justifié** dans un commentaire pourquoi.

```tsx
// CORRECT — DSFR pour la structure, Tailwind pour le détail
<div className="fr-card fr-card--shadow flex items-center gap-2">
  <span className="fr-badge fr-badge--success">Autorisé</span>
</div>

// INTERDIT — CSS inline alors qu'une classe DSFR existe
<div style={{ padding: 16, border: "1px solid #ddd" }}>...</div>

// TOLÉRÉ — uniquement si justifié
<div
  className="fr-grid-row"
  // Hauteur min imposée par la maquette, non couverte par DSFR
  style={{ minHeight: "320px" }}
>
```

Règles :

- Ne jamais réinventer un composant DSFR existant (callout, alert, accordion, badge, etc.).
- En cas de doute, chercher d'abord dans la doc DSFR avant d'écrire du Tailwind.
- Si une override de style DSFR est nécessaire, utiliser `mt-0!` (Tailwind v4 important) plutôt qu'un fichier CSS séparé.
- Pas de framework UI tiers (Material UI, Chakra, etc.) — la conformité Beta.gouv impose DSFR.

## Workflow obligatoire

### Vérification post-implémentation

Après toute implémentation ou modification de code, TOUJOURS lancer la vérification rapide :

```bash
pnpm validate
```

(équivaut à `pnpm format && pnpm lint:fix && pnpm typecheck && pnpm test` — environ 2 secondes)

**Avant un push / une PR / un merge**, lancer la vérification complète qui ajoute les tests E2E Playwright :

```bash
pnpm validate:full
```

(équivaut à `pnpm validate && pnpm test:e2e` — environ 30 secondes, démarre un dev server Vite + Chromium)

Si des erreurs apparaissent, les corriger immédiatement et relancer jusqu'à ce que tout passe. Ne JAMAIS considérer une tâche comme terminée sans cette vérification.

Voir aussi le skill `/verif` qui orchestre ces étapes.

### ADR automatique

Quand une tâche implique un **choix architectural significatif**, créer automatiquement un ADR dans `docs/adr/` via le skill `/adr`. Déclencheurs :

- Ajout ou remplacement d'une dépendance majeure
- Nouveau pattern de code (nouvelle convention, nouvelle abstraction)
- Changement d'infrastructure ou de déploiement
- Choix entre plusieurs approches avec des compromis

Ne PAS créer d'ADR pour les corrections de bugs, refactorings mineurs ou fonctionnalités qui suivent un pattern existant.

### Commits : simples et conventionnels

Suivre **Conventional Commits** : un titre court, une seule ligne de description.

Format :

```
<type>(<scope?>): <titre court à l'impératif>

<description en une seule ligne, le pourquoi plus que le quoi>
```

**Types courants** : `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `build`, `ci`.

**Exemples** :

```
feat(abattoirs): moteur de règles + oracle 2744 cas

Implémentation des 5 règles métier dans une architecture DDD pour préparer l'arrivée du 2e simulateur.
```

```
fix(marque): corrige le cas ZRII MR-PPA dest non MCA

Le LPS retournait null à tort pour la zone destinataire ZRI.
```

```
docs: ADR architecture DDD du moteur

Justifie le découpage en bounded contexts et la séparation data/validation/logique.
```

Règles :

- Titre **sous 70 caractères**, à l'impératif, en minuscules.
- **Une seule ligne** de description (pas de listes à puces, pas de paragraphes).
- Préférer le **pourquoi** au quoi (le diff montre déjà le quoi).
- **Aucune mention d'auteur ou de co-auteur** dans le corps du commit (pas de `Co-Authored-By`, pas de `Generated with`, etc.). L'auteur git suffit.

### Compaction du contexte

Lors de la compaction automatique ou manuelle (`/compact`), TOUJOURS préserver :

- La liste des fichiers modifiés dans la session
- Les commandes de test et vérification à relancer
- Les Gotchas rencontrés pendant la session
- Les décisions architecturales prises

## Commandes courantes

```bash
# Setup initial
pnpm install                # Installation des dépendances

# Développement
pnpm dev                    # Lance le serveur Vite (http://localhost:5173)

# Tests
pnpm test                   # Tests unitaires Vitest
pnpm test:watch             # Tests Vitest en mode watch
pnpm test:e2e               # Tests E2E Playwright (Chromium)
pnpm test:e2e:ui            # Tests E2E en mode UI interactif

# Qualité de code
pnpm lint                   # Linter ESLint
pnpm lint:fix               # Linter ESLint avec correction auto
pnpm format                 # Formatter Prettier
pnpm format:check           # Vérifier le formatage sans modifier
pnpm typecheck              # Vérification TypeScript
pnpm validate               # Vérif rapide : format + lint:fix + typecheck + test (~2s)
pnpm validate:full          # Vérif complète : validate + test:e2e (~30s)

# Build
pnpm build                  # Build statique (dist/)
pnpm preview                # Prévisualisation du build
```

## Architecture

Structure organisée par features (UI) avec un moteur de règles isolé en TypeScript pur, organisé en **DDD propre mais simple** :

```
src/
├── engine/                       # Moteur de règles (TypeScript pur, sans React)
│   ├── index.ts                  # Public API du moteur (re-exports)
│   ├── shared/                   # Shared kernel : concepts communs aux contexts
│   │   ├── types.ts              # Enums communs (Zone, Statut, Marque, ...)
│   │   └── index.ts
│   ├── abattoirs/                # Bounded context #1
│   │   ├── index.ts              # API publique du context
│   │   ├── types.ts              # AbattoirsInputs, AbattoirsOutputs
│   │   ├── schema.ts             # Schémas Zod (data definition)
│   │   ├── parse.ts              # Fonctions de validation (parse/safeParse)
│   │   ├── evaluate.ts           # Orchestrateur (evaluateAbattoir)
│   │   ├── evaluate.spec.ts      # Test oracle (fixture 2 744 cas)
│   │   └── rules/                # Règles métier atomiques
│   │       └── *.ts + *.spec.ts
│   └── etablissements/           # Bounded context #2 (placeholder)
├── features/                     # Une feature = un parcours utilisateur
│   ├── home/pages/
│   └── simulateurs/
│       ├── abattoirs/pages/
│       └── etablissements/pages/
└── shared/                       # Composants UI, hooks, utilitaires
```

### Principes DDD appliqués

- **Bounded contexts** : un dossier par simulateur sous `src/engine/`. **Aucun import croisé** entre contexts.
- **Shared kernel minimal** : `src/engine/shared/` contient uniquement les concepts vraiment partagés (enums communs aux simulateurs).
- **Public API par context** : un `index.ts` expose les entry points (evaluator, types, parser). Le reste de l'app importe via cet `index.ts` ou via `src/engine/index.ts`.
- **Séparation des couches dans un context** : data (`schema.ts`), validation (`parse.ts`), logique (`rules/` + `evaluate.ts`) sont des fichiers distincts.
- **Pas de couches inutiles** : pas de Repository, pas de Domain Service abstrait, pas de DI container. On reste pragmatique tant que le besoin ne le justifie pas.

**Règle d'or** : le moteur (`src/engine/`) ne doit JAMAIS importer de React ni de dépendances UI. Il doit être testable en pur TypeScript.

## Logique métier

Les règles PPA (Peste Porcine Africaine) sont implémentées dans `src/engine/<context>/rules/`. Toute modification de ces règles DOIT être accompagnée :

1. d'un test Vitest qui couvre le nouveau cas (`*.spec.ts` co-localisé)
2. d'une référence à la source réglementaire (instruction technique, arrêté, ou fichier dans `docs/sources/`) dans un commentaire

## Versionnage des règles métier

Chaque simulateur a son fichier de versions lié aux arrêtés officiels :

- Source de vérité : `src/engine/<context>/versions.ts` (tableau antéchronologique, `[0]` = version courante)
- Affichage : date dans le panneau résultats + page `/historique-versions`
- Procédure PR « nouvel arrêté » détaillée dans [`docs/versions.md`](./docs/versions.md)

Quand un nouvel arrêté entre en vigueur :

1. Copier les sources datées dans `docs/sources/`
2. Régénérer la fixture (`pnpm fixture:abattoirs`)
3. Adapter les règles jusqu'à `pnpm test` vert
4. **Ajouter une entrée en tête de `ABATTOIRS_VERSIONS`** avec `dateEffet` (ISO), `arrete`, `sources`, `changements`, `pullRequest`
5. `pnpm validate`
6. Commit `feat(<context>): nouvelle version YYYY-MM-DD`

La spec `versions.spec.ts` garantit l'ordre antéchronologique strict et le format ISO des dates.

## Monitoring des erreurs

Pas de Sentry — solution maison légère, RGPD-friendly, zéro dépendance.

**Pipeline (Phase 1)** :

1. `installGlobalHandlers()` dans `src/main.tsx` pose `window.error` + `unhandledrejection`.
2. `<ErrorBoundary>` dans `src/App.tsx` wrappe `<Routes>` et capture les erreurs de rendu React.
3. Tous les chemins appellent `reportError(error, context)` qui log un payload structuré via `console.error("[ODICE error]", { … })`.

**Visibilité actuelle** : DevTools utilisateur uniquement (console).

**Phase 2 (à venir)** : `reportError` POSTera le payload vers un endpoint configurable via `VITE_ERROR_ENDPOINT` (Mattermost webhook ou petit endpoint Scalingo Node).

**Fichiers** :

- `src/shared/monitoring/error-reporter.ts` — `reportError(error, context)`
- `src/shared/monitoring/install-global-handlers.ts` — listeners globaux
- `src/shared/components/ErrorBoundary.tsx` — boundary React
- `src/features/error/pages/ErrorFallbackPage.tsx` — UI de fallback

**Tester en local** :

```ts
// dans n'importe quel composant
throw new Error("test ErrorBoundary");
```

Ou depuis la console DevTools : `throw new Error("test")` (capté par `window.error`).

## Tests

- Fichiers de test à côté des fichiers source : `*.spec.ts` / `*.spec.tsx`
- Tests E2E dans `tests/e2e/` (Playwright)
- Fixtures partagées dans `tests/fixtures/`
- Le moteur de règles doit avoir une couverture de tests élevée

## Déploiement

- Plateforme : Scalingo
- Type de build : application statique (sortie `dist/`)
- CI/CD : GitHub Actions (voir `.github/workflows/ci.yml`)

## Gotchas

Pièges rencontrés en session. Chaque entrée documente un piège pour éviter d'y retomber.

### Tailwind 4 : utiliser `@import "tailwindcss"` (pas `@tailwind ...`)

Tailwind v4 utilise un nouveau moteur. Dans `styles/index.css`, il faut écrire :

```css
@import "tailwindcss";
```

Et **PAS** la syntaxe v3 :

```css
/* INCORRECT — génère une CSS partielle, beaucoup de classes silencieusement absentes */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Avec la legacy syntax, Tailwind v4 ne génère qu'un sous-ensemble réduit (`block`, `relative`, etc.), et les utilitaires courants (`mt-0`, `flex`, `gap-*`, etc.) **manquent silencieusement** du bundle, sans erreur. Symptôme typique : une classe Tailwind écrite dans le code n'a aucun effet visuel.

Pour l'override des styles DSFR (forte spécificité), les deux syntaxes `!important` Tailwind sont valides en v4 : `!mt-0` (préfixe, legacy) ou `mt-0!` (suffixe, nouvelle). Le projet utilise la nouvelle (`mt-0!`) par défaut.
