# ADR-0006 : Fixture oracle compacte pour le simulateur Autres Établissements

**Date** : 2026-06-23
**Statut** : Accepté

## Contexte

Le simulateur Autres Établissements a 9 entrées (vs 6 pour Abattoirs), soit un produit cartésien de **32 928 combinaisons** (vs 2 744). L'oracle de test est, comme pour Abattoirs, le fichier xlsx fourni par l'équipe métier (`docs/sources/etablissements-test-formules-20260623.xlsx`).

Deux problèmes d'échelle apparaissent par rapport au pattern Abattoirs :

1. **Taille de la fixture** : au format objet pretty-printed (comme `oracle-2744.json`), la fixture des 32 928 cas pèserait ~18-22 Mo et générerait un diff de 600 000+ lignes, ingérable en revue et lourd pour le dépôt.
2. **Lisibilité du test** : un `it.each` sur 32 928 cas génère 32 928 entrées dans le reporter Vitest — sortie verbeuse et plus lente.

## Décision

> Pour le simulateur Autres Établissements uniquement, la fixture oracle est sérialisée au **format tuple compact** (`{ meta, cases: [[inputs[9], outputs[7]], …] }`, un cas par ligne, booléens encodés `1`/`0`), et le test oracle est un **unique test agrégé** qui compte les écarts plutôt qu'un `it.each` par cas.

- Fichier : `tests/fixtures/etablissements/oracle-32928.json` (~5,1 Mo).
- Génération : `scripts/extract-etablissements-fixture.ts` (`pnpm fixture:etablissements`), garde-fou `:check` dans `pnpm validate`.
- La fixture est exclue de Prettier (`.prettierignore` → `tests/fixtures/`) : son format est maîtrisé par le script d'extraction.
- Le test (`src/engine/etablissements/evaluate.spec.ts`) parcourt les cas, collecte les divergences et n'affiche que les 10 premières.

Abattoirs **n'est pas modifié** (2 744 cas, format objet + `it.each` restent adaptés à cette échelle).

## Options envisagées

### Option A — Tuple compact + test agrégé (retenue)

- Avantages : ~5,1 Mo (3-4× plus léger), test rapide et lisible, source de vérité (xlsx) committée à côté.
- Inconvénients : format moins auto-descriptif (mitigé par `meta.inputKeys`/`outputKeys`), asymétrie avec Abattoirs.

### Option B — Même format qu'Abattoirs (objets pretty + it.each)

- Avantages : symétrie totale.
- Inconvénients : ~18-22 Mo, diff illisible, reporter Vitest noyé sous 32 928 entrées.

### Option C — Parser le xlsx au runtime du test

- Avantages : aucun JSON dérivé committé.
- Inconvénients : couple le test à la lib `xlsx` et au binaire de 3,5 Mo ; perte de l'oracle figé et versionné en JSON.

## Conséquences

### Positives

- Dépôt et revues raisonnables ; CI rapide.
- Couverture exhaustive conservée (100 % des 32 928 cas vérifiés à chaque run).

### Négatives / Risques

- Deux formats de fixture coexistent (Abattoirs objet, Établissements tuple) : documenté ici et dans les scripts.
- Le format tuple dépend de l'ordre des colonnes : `meta.inputKeys`/`outputKeys` et l'assertion d'en-tête du script protègent contre une dérive silencieuse.

## Liens

- [scripts/extract-etablissements-fixture.ts](../../scripts/extract-etablissements-fixture.ts)
- [src/engine/etablissements/evaluate.spec.ts](../../src/engine/etablissements/evaluate.spec.ts)
- [ADR-0003 — oracle xlsx](./0003-oracle-xlsx-moteur.md)
