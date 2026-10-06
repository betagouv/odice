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
| `traitementObligatoireUe`    | booléen (obligation UE, toujours déduit) |
| `zoneExpediteur`             | 7 zones                                  |
| `mcaExpediteur`              | booléen (agrément MCA expéditeur)        |
| `traitementRealise`          | booléen (traitement effectivement fait)  |
| `zoneDestinataire`           | 7 zones                                  |
| `mcaDestinataire`            | booléen (agrément MCA destinataire)      |

Produit cartésien : **32 928 combinaisons** (toutes présentes dans l'oracle).

## Sorties (7)

Identiques au simulateur Abattoirs : `marque`, `frMouvement`, `ueMouvement`, `frTraitement`, `ueTraitement`, `frDocument` (LPS), `ueDocument` (certification).

Invariants vérifiés sur l'oracle : `FR autorisé ⟺ marque de sortie ≠ ∅` ; `UE autorisé ⟺ marque de sortie = ovale`.

## Saisie : situations impossibles et valeurs déduites

Le formulaire ne pose que les questions de traitement dont la réponse n'est pas connue d'avance ; les autres entrées du moteur sont déduites (règles dans `src/features/simulateurs/etablissements/components/traitementRegles.ts`, cf. [ADR-0016](./adr/0016-autres-etablissements-valeurs-deduites.md)).

**Situations impossibles** (alerte, destination masquée, validation bloquée) :

- porcs en zone indemne ou ZRI avec une marque ovale barrée ou à diagonales parallèles : mélange de lot probable ;
- porcs en ZI FS réflexe : mouvements interdits.

**Questions affichées** :

- « Un traitement d'atténuation est-il obligatoire pour les mouvements nationaux ? » : seulement en ZRIII avec une ovale barrée ou à diagonales ;
- « Un traitement d'atténuation a-t-il été réalisé ? » : pour toute ovale barrée, ou si le traitement national a été déclaré obligatoire ;
- la question « obligatoire pour les échanges UE » n'est plus posée.

**Valeurs déduites** (national / UE / réalisé) :

| Zone d'origine | Marque | National | UE | Réalisé | Source |
| --- | --- | --- | --- | --- | --- |
| indemne, ZRI | ovale | NON | NON | NON | M1 (réalisé sans effet) |
| ZP, ZS | ovale, diagonales | OUI | OUI | OUI | M2, M3 ; national = hypothèse |
| ZP, ZS | ovale barrée | OUI | OUI | saisi | M4, M3 |
| ZI FS, ZRII | ovale barrée | NON | OUI | saisi | M5 |
| ZI FS, ZRII | diagonales | NON | NON | NON | sans effet sur le résultat |
| ZI FS, ZRII, ZRIII | ovale | NON | NON | NON | hypothèse |
| ZRIII | ovale barrée | saisi | OUI | saisi | M6 |
| ZRIII | diagonales | saisi | = national | saisi si national = OUI, sinon NON | M3 ; réalisé = hypothèse |

## Implémentation

- Moteur TypeScript pur : `src/engine/etablissements/`
- Règles (`rules/`) : `marque`, `mouvement`, `traitement`, `lps`, `certification` — traductions fidèles des formules Excel de `docs/sources/formules-20260623.docx`.
- Ordre d'évaluation : `marque` → `traitement` → `lps` (le LPS dépend de la marque et du traitement FR) ; `certification` ← `marque`.
- Oracle : `tests/fixtures/etablissements/oracle-32928.json` (format compact, cf. [ADR-0006](./adr/0006-fixture-oracle-compacte-etablissements.md)), régénérable via `pnpm fixture:etablissements`.

## Versionnage

`src/engine/etablissements/versions.ts` — procédure « nouvel arrêté » : voir [docs/versions.md](./versions.md).
