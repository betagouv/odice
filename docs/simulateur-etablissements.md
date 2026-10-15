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

**Ordre d'apparition de la provenance** : zone d'origine des porcs seule, puis marque sanitaire une fois la zone choisie, puis les questions de traitement applicables une fois la marque choisie ; la destination apparaît ensuite.

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

## Correctif métier du 2026-10-08 (marque de sortie)

Retour métier (« Erreur sortie : matière première marque ovale ») : matière première ZI FS en ovale, expéditeur ZI FS agréé MCA, destinataire ZI FS non agréé MCA donnait « mouvement interdit » partout.

**Règle ajoutée** (`src/engine/etablissements/rules/marque.ts`) : matière première en ZI FS / ZRII / ZRIII (ou ZP / ZS avec traitement réalisé), marque ovale en entrée, expéditeur en zone réglementée **agréé MCA**, destinataire en zone réglementée **non agréé MCA** → marque **ovale diagonales parallèles** : France autorisé, UE interdit, traitement France non obligatoire, laissez-passer sanitaire non requis (résultats vérifiés pour toutes les entrées que le formulaire peut produire).

**Écart avec la formule Excel** : le xlsx ne donne aucune marque pour ces combinaisons (trou de la formule). 800 cas de l'oracle sont concernés ; la fixture reste celle du xlsx et `evaluate.spec.ts` les traite à part (il vérifie que ce sont uniquement des trous). Pour ZP / ZS, la condition « traitement réalisé » des clauses voisines est conservée : l'énoncé métier ne la mentionne pas, mais elle est sans effet dans le formulaire, qui impose déjà « réalisé = oui » (560 cas moteur de plus si elle était supprimée).

## Implémentation

- Moteur TypeScript pur : `src/engine/etablissements/`
- Règles (`rules/`) : `marque`, `mouvement`, `traitement`, `lps`, `certification` — traductions fidèles des formules Excel de `docs/sources/formules-20260623.docx`.
- Ordre d'évaluation : `marque` → `traitement` → `lps` (le LPS dépend de la marque et du traitement FR) ; `certification` ← `marque`.
- Oracle : `tests/fixtures/etablissements/oracle-32928.json` (format compact, cf. [ADR-0006](./adr/0006-fixture-oracle-compacte-etablissements.md)), régénérable via `pnpm fixture:etablissements`.

## Versionnage

`src/engine/etablissements/versions.ts` — procédure « nouvel arrêté » : voir [docs/versions.md](./versions.md).
