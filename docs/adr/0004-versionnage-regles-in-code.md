# ADR-0004 : Versionnage des règles métier in-code

**Date** : 2026-05-23
**Statut** : Accepté

## Contexte

Le simulateur ODICE est un outil **à portée réglementaire** : ses règles dérivent d'arrêtés officiels qui évoluent. À chaque nouvel arrêté, le code doit être mis à jour, et il faut pouvoir :

1. **Tracer** quelle version du simulateur correspond à quel arrêté
2. **Afficher** à l'utilisateur la date d'effet de la version courante (« Dernière mise à jour : 4 février 2026 »)
3. **Permettre** une navigation dans l'historique des versions (page dédiée)
4. **Documenter** la procédure d'ajout d'une nouvelle version

Sans système explicite, on perd la traçabilité réglementaire et on s'expose à des conflits métier (« quelle version était en vigueur le X mars ? »).

## Décision

> Chaque bounded context (`abattoirs`, `etablissements`…) expose un tableau `<CONTEXT>_VERSIONS` in-code, antéchronologique, contenant `dateEffet` (ISO), `arrete`, `sources`, `changements`, `pullRequest`. La version courante = `[0]`. L'UI dérive l'affichage de cette source unique.

Pattern :

```ts
// src/engine/abattoirs/versions.ts
export const ABATTOIRS_VERSIONS: readonly SimulateurVersion[] = [
  {
    dateEffet: "2026-02-04",
    arrete: { titre: "...", reference: "NOR...", url: "..." },
    sources: ["docs/sources/abattoirs-formules-20260512.docx", ...],
    changements: ["..."],
    pullRequest: "https://github.com/.../pull/...",
  },
];
```

Procédure PR « nouvel arrêté » documentée dans [`docs/versions.md`](../versions.md) (9 étapes).

## Options envisagées

### Option A — Tableau in-code par bounded context (retenue)

- Avantages :
  - Versionné dans git en même temps que les règles → cohérence garantie
  - Aucune infrastructure (pas de backend, pas de CMS)
  - Typage strict TS, refactor-friendly
  - Une seule source de vérité pour le panneau résultat ET la page historique
  - Cohérent avec le DDD (ADR-0002) : chaque context gère ses versions
- Inconvénients :
  - Toute mise à jour nécessite une PR (acceptable pour un projet à versions peu fréquentes)
  - Pas d'API publique pour consommer l'historique depuis l'extérieur

### Option B — Fichier JSON externe non typé

- Avantages : édition possible sans toucher au code
- Inconvénients : pas de typecheck, risque d'erreur silencieuse

### Option C — CMS / backend dédié

- Avantages : édition par non-développeur
- Inconvénients : infrastructure à maintenir ; couplage UI/back ; overkill pour 1-3 versions/an

### Option D — `package.json` version + CHANGELOG

- Avantages : convention standard
- Inconvénients : ne capture pas les métadonnées riches (arrêté, NOR, sources, PR)

## Conséquences

### Positives

- La date « Dernière mise à jour » du panneau résultat est dérivée automatiquement (`ABATTOIRS_VERSIONS[0].dateEffet` + `formatDateIsoToLongFr`)
- Page `/historique-versions` rend les entrées du tableau (titre arrêté, sources cliquables, changements, lien PR)
- La spec `versions.spec.ts` garantit l'ordre antéchronologique strict et le format ISO
- Le futur simulateur Établissements suivra le même pattern (`ETABLISSEMENTS_VERSIONS`)
- Lien fort entre version, sources xlsx (ADR-0003), et PR git

### Négatives / Risques

- Un dev qui ajoute une version peut oublier de mettre à jour le tableau → mitigé par la procédure documentée + intégration dans la check-list PR
- Pas d'API REST si un consommateur externe veut connaître les versions (acceptable au stade actuel)
- Le tableau grossit linéairement avec les arrêtés (négligeable : peu de versions/an attendues)

### Migration

Effectuée dans la PR initiale du versionnage :
- Création de `src/engine/abattoirs/versions.ts` + spec
- Export via `src/engine/abattoirs/index.ts`
- Page `HistoriqueVersionsPage` + route `/historique-versions`
- Câblage de la date dans `AbattoirsResult`
- Documentation `docs/versions.md` + section CLAUDE.md

## Liens

- Source de vérité Abattoirs : [`src/engine/abattoirs/versions.ts`](../../src/engine/abattoirs/versions.ts)
- Page UI : [`src/features/historique/pages/HistoriqueVersionsPage.tsx`](../../src/features/historique/pages/HistoriqueVersionsPage.tsx)
- Procédure PR : [`docs/versions.md`](../versions.md)
- ADR-0002 (DDD) : justifie le découpage par bounded context
- ADR-0003 (oracle xlsx) : les sources versionnées dans `docs/sources/` sont référencées par chaque version
