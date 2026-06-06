# ADR-0003 : Oracle xlsx pour valider le moteur de règles

**Date** : 2026-05-23
**Statut** : Accepté

## Contexte

Les règles métier PPA sont définies par l'équipe métier (DDPP) dans un fichier xlsx contenant toutes les combinaisons d'entrées et leurs sorties attendues (2 744 cas pour le simulateur Abattoirs : 7 zones × 2 statuts × 7 zones × 2 MCA × 7 zones × 2 MCA).

Le challenge : garantir qu'à chaque évolution du moteur de règles, on reste **strictement conforme** à ce que l'équipe métier a validé, et détecter immédiatement toute divergence.

## Décision

> Le xlsx fourni par l'équipe métier est la **source de vérité absolue** des règles. Il est versionné dans le repo, extrait au format JSON committé, et utilisé comme oracle dans une spec qui itère sur l'intégralité des cas.

Pipeline :

1. `docs/sources/abattoirs-test-formules-YYYYMMDD.xlsx` — fichier source versionné dans git
2. `scripts/extract-abattoirs-fixture.ts` — script Node natif (TS strip-types) qui extrait le xlsx → JSON
3. `tests/fixtures/abattoirs/oracle-2744.json` — fixture committée (~1.4 Mo, lisible en diff)
4. `src/engine/abattoirs/evaluate.spec.ts` — itère sur les 2 744 cas via `it.each`
5. `pnpm fixture:abattoirs:check` — vérifie que le JSON committé correspond au xlsx (intégré à `pnpm validate`)

## Options envisagées

### Option A — Oracle xlsx + extraction JSON (retenue)

- Avantages :
  - Source de vérité incontestable, fournie par l'équipe métier
  - Garantie de conformité à 100 % via itération exhaustive
  - Diff git du JSON montre **précisément** les combinaisons qui changent à chaque arrêté
  - Détection automatique des dérives via le check intégré à `validate`
  - Le métier peut continuer à travailler avec son outil (Excel) sans contrainte technique
- Inconvénients :
  - 2 fichiers à versionner (xlsx binaire + JSON dérivé)
  - JSON de 1.4 Mo dans le repo
  - Script d'extraction à maintenir si la structure du xlsx évolue

### Option B — Tests à la main, cas représentatifs uniquement

- Avantages : peu de fichiers, tests lisibles
- Inconvénients : aucune garantie d'exhaustivité ; un cas non testé peut casser silencieusement

### Option C — Lecture du xlsx au runtime des tests

- Avantages : pas de JSON dérivé à committer
- Inconvénients : dépendance `xlsx` requise pour faire tourner les tests ; pas de diff lisible sur les changements

### Option D — Migration des règles vers Publicodes (DSL Beta.gouv)

- Avantages : framework officiel Beta.gouv ; les règles deviennent déclaratives
- Inconvénients : courbe d'apprentissage ; ne supprime pas le besoin d'oracle ; refonte importante

## Conséquences

### Positives

- Toute régression du moteur est détectée à `pnpm test` (2 744 assertions exhaustives, ~50 ms)
- Le workflow PR « nouvel arrêté » est mécanisable et documenté (cf. [`docs/versions.md`](../versions.md))
- L'équipe métier garde le contrôle de la spec (Excel reste leur outil)
- Les tests ciblés (`marque.spec.ts`, `mouvement.spec.ts`…) complètent l'oracle pour la lisibilité diagnostic

### Négatives / Risques

- Si la structure du xlsx change (nouvelle colonne, nouvel input), le script d'extraction échoue avec un message explicite et requiert intervention humaine simultanée sur le script + le moteur
- Le JSON de 1.4 Mo gonfle le repo (acceptable pour un projet à versions peu fréquentes)
- Couplage fort entre l'équipe métier et le format xlsx (changement vers un autre outil = nouveau script d'extraction)

### Migration

Effectuée dans la PR initiale du simulateur Abattoirs :
- Copie du xlsx dans `docs/sources/`
- Création du script d'extraction TS
- Génération de la fixture initiale
- Spec oracle ajoutée
- Procédure documentée dans `docs/versions.md` + CLAUDE.md

## Liens

- Script d'extraction : [`scripts/extract-abattoirs-fixture.ts`](../../scripts/extract-abattoirs-fixture.ts)
- Fixture : [`tests/fixtures/abattoirs/oracle-2744.json`](../../tests/fixtures/abattoirs/oracle-2744.json)
- Procédure : [`docs/versions.md`](../versions.md)
- ADR-0002 (DDD) : organisation du moteur consommateur de l'oracle
- ADR-0004 (versionnage) : tracking des versions xlsx successives
