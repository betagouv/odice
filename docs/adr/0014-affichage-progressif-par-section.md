# ADR-0014 : Affichage progressif par section des simulateurs

**Date** : 2026-10-05
**Statut** : Accepté — remplace partiellement l'[ADR-0007](./0007-affichage-progressif-champs-simulateurs.md) (granularité de la révélation)

## Contexte

L'[ADR-0007](./0007-affichage-progressif-champs-simulateurs.md) a introduit un affichage progressif **champ par champ** : chaque saisie révèle le champ suivant. Avec la refonte des formulaires ([ADR-0013](./0013-refonte-ui-simulateurs-et-retrait-aide.md)), les champs sont regroupés en parties numérotées (votre établissement, 1. Provenance, 2. Destination).

La spec métier demande désormais un affichage **partie par partie** : une partie s'affiche en entier dès que la précédente est complète. Exemple : la question « L'établissement destinataire est-il en possession d'un agrément zoosanitaire MCA ? » doit apparaître en même temps que la zone du destinataire, et non après sa saisie. Seule exception : le statut réglementaire (Abattoirs) n'apparaît dans la provenance que si la zone d'origine vaut ZRII ou ZRIII.

## Décision

> Nous étendons `useProgressiveFields` avec une notion de **section** : les champs consécutifs d'une même section sont révélés ensemble, et la section suivante n'apparaît que lorsque tous les champs applicables des précédentes sont remplis.

- Attribut `section` optionnel dans `ProgressiveFieldConfig` ; un champ sans section forme sa propre section (comportement champ par champ de l'ADR-0007 conservé).
- Les autres principes de l'ADR-0007 sont inchangés : révélation monotone, `isApplicable` pour les champs conditionnels, `revealAll` au reset.
- Les deux formulaires déclarent leurs trois sections (`abattoir` ou `etablissement`, `provenance`, `destination`).
- Exception (2026-10-08) : dans Autres établissements, la provenance est elle-même révélée en trois temps, comme sur les maquettes : `provenance-zone` (zone d'origine des porcs), puis `provenance-viandes` (marque) une fois la zone choisie, puis `provenance-traitement` (questions de traitement applicables) une fois la marque choisie. S'il n'y a aucune question de traitement, la destination suit directement la marque.

## Options envisagées

### Option A — Section comme attribut des champs dans le hook existant (retenue)

- Avantages : un seul mécanisme de révélation ; rétrocompatible (sans section = champ par champ) ; les champs conditionnels (statut, traitements) s'intègrent naturellement à leur section ; logique pure testée hors React.
- Inconvénients : les champs d'une même section doivent être déclarés consécutivement dans `FIELDS`.

### Option B — Visibilité des sections calculée dans chaque formulaire

- Avantages : aucune modification du hook.
- Inconvénients : duplication de la logique « section complète » dans deux formulaires, risque de divergence (cf. option C de l'ADR-0007).

### Option C — Afficher tous les champs d'emblée

- Avantages : aucune logique de révélation.
- Inconvénients : contraire à la spec et à la saisie guidée validée par l'ADR-0007.

## Conséquences

### Positives

- Parcours conforme à la spec : chaque partie se lit et se remplit d'un bloc.
- Comportement identique dans les deux simulateurs.

### Négatives / Risques

- Une section affiche d'un coup plus de champs (jusqu'à 5 dans la provenance d'Autres établissements, traitements compris).
- Le blocage reste strict : un champ conditionnel vide (statut en ZRII/ZRIII, traitement obligatoire en zone réglementée) masque la section suivante jusqu'à sa saisie.

### Migration

- `computeRevealed` parcourt les sections au lieu des champs ; tests unitaires ajoutés dans `useProgressiveFields.spec.ts`.
- `AbattoirsForm` et `EtablissementsForm` : ajout de `section` à chaque entrée de `FIELDS`.
- Tests E2E d'affichage progressif réécrits (section complète révélée en entier).

## Liens

- Hook : [`useProgressiveFields.ts`](../../src/shared/hooks/useProgressiveFields.ts)
- Formulaires : [`AbattoirsForm.tsx`](../../src/features/simulateurs/abattoirs/components/AbattoirsForm.tsx), [`EtablissementsForm.tsx`](../../src/features/simulateurs/etablissements/components/EtablissementsForm.tsx)
- ADR liés : [ADR-0007](./0007-affichage-progressif-champs-simulateurs.md), [ADR-0013](./0013-refonte-ui-simulateurs-et-retrait-aide.md)
