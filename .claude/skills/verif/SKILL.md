---
name: verif
description: Vérification post-implémentation (format + lint + typecheck + tests + e2e optionnel)
---

# Vérification complète

Pipeline de vérification à lancer après chaque implémentation.

## Vérification rapide (par défaut)

Pour la majorité des cas (refactor logique, ajout de tests unitaires, modifs hors UI),
une seule commande suffit :

```bash
pnpm validate
```

Si elle échoue, suivre la séquence détaillée ci-dessous pour identifier le problème.

## Vérification complète (avant push / PR)

Si la modification touche l'UI, le routing, le DSFR, ou avant de pousser sur la branche :

```bash
pnpm validate:full
```

Cette commande ajoute les tests E2E Playwright après le `validate` rapide.

## Séquence détaillée

### Étape 1 — Formatage

Lance `pnpm format`. Si des fichiers sont modifiés, note-les.

### Étape 2 — Lint

Lance `pnpm lint:fix`.
Si des erreurs ESLint persistent, corrige-les directement dans le code et relance `pnpm lint`.

### Étape 3 — TypeScript

Lance `pnpm typecheck`.
Corrige les erreurs de typage (casts explicites, imports manquants, types).

### Étape 4 — Tests unitaires (Vitest)

Lance `pnpm test`.
Analyse les échecs et corrige le code ou les tests.

### Étape 5 — Tests E2E (Playwright) — pour les changements UI

Si la modification touche l'UI ou le routing, ou avant un push :

```bash
pnpm test:e2e
```

Pré-requis : `pnpm exec playwright install chromium` (à faire une seule fois par poste).

## Résumé

Affiche un résumé concis :

```
Vérification terminée :
- Format       : OK / X fichiers corrigés
- Lint         : OK / X erreurs corrigées
- TypeScript   : OK / X erreurs corrigées
- Tests unit.  : OK / X tests corrigés
- Tests E2E    : OK / non lancé
```

Si tout est OK dès le départ, affiche simplement : `Vérification OK — aucune correction nécessaire.`
