# Simulateur Autres Établissements

Aide à la décision pour les **établissements du secteur alimentaire** (découpe, transformation, entrepôt) qui **réexpédient** de la viande déjà en circulation, en contexte de Peste Porcine Africaine.

## Différence clé avec le simulateur Abattoirs

Un abattoir produit la viande et **appose** une marque (la marque est une sortie). Un autre établissement **reçoit** une viande déjà marquée (`marqueViandes` est une **entrée**) et le moteur recalcule la marque à apposer en sortie selon la zone, les agréments MCA et le traitement d'atténuation.

## Entrées (9)

| Champ                        | Valeurs                                  |
| ---------------------------- | ---------------------------------------- |
| `zoneSuides`                 | 7 zones                                  |
| `marqueViandes`              | ovale / ovale barrée / diagonales //     |
| `traitementObligatoireFr`    | booléen (obligation FR)                  |
| `traitementObligatoireUe`    | booléen (obligation UE)                  |
| `zoneExpediteur`             | 7 zones                                  |
| `mcaExpediteur`              | booléen (agrément MCA expéditeur)        |
| `traitementRealise`          | booléen (traitement effectivement fait)  |
| `zoneDestinataire`           | 7 zones                                  |
| `mcaDestinataire`            | booléen (agrément MCA destinataire)      |

Produit cartésien : **32 928 combinaisons** (toutes présentes dans l'oracle).

## Sorties (7)

Identiques au simulateur Abattoirs : `marque`, `frMouvement`, `ueMouvement`, `frTraitement`, `ueTraitement`, `frDocument` (LPS), `ueDocument` (certification).

Invariants vérifiés sur l'oracle : `FR autorisé ⟺ marque de sortie ≠ ∅` ; `UE autorisé ⟺ marque de sortie = ovale`.

## Implémentation

- Moteur TypeScript pur : `src/engine/etablissements/`
- Règles (`rules/`) : `marque`, `mouvement`, `traitement`, `lps`, `certification` — traductions fidèles des formules Excel de `docs/sources/formules-20260623.docx`.
- Ordre d'évaluation : `marque` → `traitement` → `lps` (le LPS dépend de la marque et du traitement FR) ; `certification` ← `marque`.
- Oracle : `tests/fixtures/etablissements/oracle-32928.json` (format compact, cf. [ADR-0006](./adr/0006-fixture-oracle-compacte-etablissements.md)), régénérable via `pnpm fixture:etablissements`.

## Versionnage

`src/engine/etablissements/versions.ts` — procédure « nouvel arrêté » : voir [docs/versions.md](./versions.md).
