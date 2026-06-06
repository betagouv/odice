# ADR-0002 : Architecture DDD « propre mais simple » pour le moteur ODICE

**Date** : 2026-05-23
**Statut** : Accepté

## Contexte

Le moteur ODICE doit héberger deux simulateurs distincts (Abattoirs, Autres Établissements) qui partagent certains concepts (zones réglementaires, marques sanitaires…) mais ont chacun leur propre logique métier, leurs propres inputs et leurs propres outputs.

L'arborescence initiale (`src/engine/{types,rules,evaluate}.ts` à plat) ne tient pas la charge dès qu'on commence à implémenter les 5 fonctions de règles + leurs schémas Zod + leurs tests. On observe :

- un fichier `types.ts` qui mélange enums partagés et types spécifiques à un simulateur,
- un fichier `schemas.ts` qui mélange définitions de données (schémas Zod) et logique de validation (fonctions parse),
- aucun frontière nette entre les deux simulateurs (risque d'imports croisés involontaires).

## Décision

> Nous structurons `src/engine/` en **bounded contexts DDD**, avec un shared kernel minimal et une séparation explicite des responsabilités dans chaque context, sans introduire de patterns plus lourds (Repository, DI, Domain Service abstrait…).

Structure :

```
src/engine/
├── index.ts                       # Public API du moteur (re-exports)
├── shared/                         # Shared kernel
│   ├── types.ts                    # Enums communs (Zone, Statut, Marque, ...)
│   └── index.ts
├── abattoirs/                     # Bounded context #1
│   ├── index.ts                    # API publique du context
│   ├── types.ts                    # AbattoirsInputs, AbattoirsOutputs
│   ├── schema.ts                   # Schémas Zod (data definition pure)
│   ├── parse.ts                    # Fonctions de validation
│   ├── evaluate.ts                 # Orchestrateur
│   ├── evaluate.spec.ts            # Test oracle (fixture 2 744 cas)
│   └── rules/                      # Règles atomiques
│       └── *.ts + *.spec.ts
└── etablissements/                # Bounded context #2 (placeholder)
```

## Options envisagées

### Option A — DDD « propre mais simple » (retenue)

- Avantages :
  - Isolation forte entre simulateurs (aucun import croisé possible par convention).
  - Public API explicite via `index.ts` par context.
  - Séparation des couches data / validation / logique à l'intérieur d'un context.
  - Évolutif : ajouter un nouveau simulateur = créer un nouveau dossier sans toucher l'existant.
- Inconvénients :
  - Plus de fichiers que le « flat » initial.
  - Un peu plus de boilerplate (index.ts par dossier).

### Option B — Flat (`src/engine/{types,rules,evaluate}.ts`)

- Avantages :
  - Très peu de fichiers.
- Inconvénients :
  - Ne tient pas la charge à plus d'un simulateur.
  - Pas de frontière naturelle entre simulateurs.
  - Mélange data definition / validation / logique dans un même fichier.

### Option C — DDD « tactical » complet (Aggregates, Domain Services, Value Objects, Repository, DI…)

- Avantages :
  - Architecture la plus pure.
- Inconvénients :
  - Sur-ingénierie pour un moteur de règles déterministe sans persistance.
  - Cohérence avec le style « pragmatique Beta.gouv » discutable.
  - Coût d'entrée pour les contributeurs.

## Conséquences

### Positives

- Le moteur reste pur TypeScript, testable sans React (règle d'or maintenue).
- Chaque simulateur peut évoluer indépendamment.
- Les imports sont prévisibles : `@engine` (racine), `@engine/abattoirs`, `@engine/shared`.
- L'arrivée du 2e simulateur (Établissements) ne nécessitera aucun refactor — il suffira de remplir le dossier `etablissements/`.

### Négatives / Risques

- Surface plus large à parcourir au démarrage. **Mitigation** : section Architecture du `CLAUDE.md` explicite.
- Tentation d'ajouter des couches au fil du temps. **Mitigation** : règle « pas de couches inutiles » dans CLAUDE.md.

### Migration

Effectuée dans cette même PR :

1. Création de `shared/`, `abattoirs/`, `etablissements/` avec leurs `index.ts`.
2. Éclatement de `types.ts` → `shared/types.ts` (enums communs) + `<context>/types.ts` (types spécifiques).
3. Split de `schemas.ts` → `abattoirs/schema.ts` (Zod pur) + `abattoirs/parse.ts` (fonctions).
4. Suppression des anciens fichiers racine (`types.ts`, `schemas.ts`, `evaluate.ts`, `evaluate.spec.ts`, `rules.ts`).
5. Création de `src/engine/index.ts` qui re-export tout.
6. Ajout de l'alias `@engine` (sans wildcard) dans tsconfig (Vite/Vitest l'avaient déjà).
7. Adaptation de `src/shared/components/ResultPanel.tsx` (1 ligne d'import).
8. Migration du script de fixture `.mjs` → `.ts` avec imports typés depuis les enums du moteur (typecheck garantit la cohérence du mapping xlsx → enum).

`pnpm validate` reste vert après chacune des étapes.

## Liens

- Documentation métier : [`docs/simulateur-abattoirs.md`](../simulateur-abattoirs.md)
- Points à valider avec l'équipe métier : [`docs/simulateur-abattoirs-points-a-valider.md`](../simulateur-abattoirs-points-a-valider.md)
- CLAUDE.md, section « Architecture »
