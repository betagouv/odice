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

Structure organisée par features, avec un moteur de règles isolé en TypeScript pur :

```
src/
├── engine/                 # Moteur de règles TypeScript pur (sans React)
│   ├── types.ts            # Types des inputs/outputs des simulateurs
│   ├── rules.ts            # Règles métier PPA
│   └── evaluate.ts         # Fonction d'évaluation principale
├── features/               # Une feature = un parcours utilisateur
│   ├── home/pages/
│   └── simulateurs/        # Sous-domaine simulateurs (regroupe les 2 parcours)
│       ├── abattoirs/pages/
│       └── etablissements/pages/
└── shared/                 # Composants, hooks, utilitaires partagés
    ├── components/
    │   ├── SimulatorForm.tsx
    │   ├── ResultPanel.tsx
    │   └── layout/Layout.tsx   # Header DSFR + Footer DSFR
    ├── config/routes.config.ts
    ├── hooks/
    └── utils/
```

**Règle d'or** : le moteur (`src/engine/`) ne doit JAMAIS importer de React ni de dépendances UI. Il doit être testable en pur TypeScript.

## Logique métier

Les règles PPA (Peste Porcine Africaine) sont implémentées dans `src/engine/rules.ts`. Toute modification de ces règles DOIT être accompagnée :

1. d'un test Vitest qui couvre le nouveau cas (`src/engine/evaluate.spec.ts`)
2. d'une référence à la source réglementaire (instruction technique, arrêté, etc.) dans un commentaire

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
