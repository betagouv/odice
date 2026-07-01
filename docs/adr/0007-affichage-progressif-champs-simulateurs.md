# ADR-0007 : Affichage progressif des champs des simulateurs

**Date** : 2026-06-29
**Statut** : Accepté

## Contexte

Les formulaires des deux simulateurs (Abattoirs, Autres Établissements) affichaient tous leurs champs d'un coup dès la sélection du type d'établissement (6 et 9 listes déroulantes). Cette densité noyait l'utilisateur et n'accompagnait pas la saisie.

Le besoin métier : ne montrer qu'un champ au départ, révéler le champ suivant à chaque saisie, générer les résultats sur clic « Valider », et faire en sorte que « Réinitialiser » vide les champs sans les masquer. Modifier une valeur ne doit jamais réinitialiser ni masquer les autres champs.

La contrainte clé : une visibilité dérivée des seules valeurs ne peut pas satisfaire « Réinitialiser vide sans masquer » (tout serait vidé donc tout serait masqué sauf le premier champ).

## Décision

> Nous pilotons la visibilité par un **état de révélation explicite et monotone**, encapsulé dans un hook partagé `useProgressiveFields`, distinct des valeurs du formulaire.

- L'ensemble des champs révélés ne recule jamais (une saisie n'en masque aucun).
- Remplir un champ révèle le champ applicable suivant (logique pure `computeRevealed`).
- `Réinitialiser` vide les valeurs mais conserve la visibilité (`revealAll`).
- Un champ conditionnel métier (statut Abattoirs) reste filtré à l'affichage par son prédicat `isApplicable`, indépendamment de la révélation.

## Options envisagées

### Option A — État de révélation explicite via hook partagé (retenue)

- Avantages : satisfait « reset vide sans masquer » ; révélation monotone robuste, y compris quand un champ conditionnel s'insère tardivement dans la séquence ; logique pure testable hors React ; mutualisée entre les deux formulaires.
- Inconvénients : un état supplémentaire à maintenir en parallèle des valeurs.

### Option B — Visibilité dérivée des valeurs

- Avantages : aucun état additionnel, purement déclaratif.
- Inconvénients : incompatible avec « reset vide sans masquer » ; un champ conditionnel inséré après coup masque à tort des champs déjà remplis.

### Option C — Logique de révélation dupliquée inline dans chaque formulaire

- Avantages : pas d'abstraction supplémentaire.
- Inconvénients : duplication d'une logique non triviale entre deux formulaires, risque de divergence.

## Conséquences

### Positives

- Saisie guidée, un champ à la fois ; UI moins dense.
- Comportement de reset conforme à l'attendu (champs visibles mais vides).
- Hook réutilisable pour de futurs simulateurs.

### Négatives / Risques

- Avec l'affichage progressif, on ne peut plus remplir les champs hors séquence : le champ statut (ZRII/ZRIII) doit être renseigné avant que les champs suivants apparaissent. Un test E2E qui remplissait statut en dernier a été adapté.

### Migration

- `AbattoirsForm` et `EtablissementsForm` branchés sur `useProgressiveFields` ; chaque champ et chaque section conditionnés par `isVisible`.
- `SimulateursIndexPage` inchangé : la modification d'une valeur efface toujours le panneau de résultats (re-clic sur Valider requis), les champs restant intacts.

## Liens

- Hook : `src/shared/hooks/useProgressiveFields.ts`
- Branche : `feat/affichage-conditionnel`
