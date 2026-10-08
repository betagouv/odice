# ADR-0013 : Refonte UI des simulateurs et retrait de la page Aide à l'utilisation

**Date** : 2026-09-30
**Statut** : Accepté

## Contexte

De nouvelles maquettes revoient le parcours des deux simulateurs (Abattoirs et Autres établissements). Le formulaire partait de la réception des viandes (zone d'origine des suidés) ; l'utilisateur raisonne pourtant d'abord depuis **son propre établissement**, puis la provenance des porcs, puis la destination des viandes. Les maquettes ajoutent aussi :

- des **infobulles** (agrément MCA, statut MR-PPA / MNR-PPA) ;
- une zone **« ZI FS réflexe »**, de même conditionnalité réglementaire que ZI FS, dans toutes les listes de zones ;
- le choix de la **marque sanitaire** par visuel, pour éviter les confusions entre les trois marques ;
- des libellés adaptés au **type d'établissement** choisi (« Zone de votre atelier de découpe. »).

La page Aide à l'utilisation, construite sur des captures de l'ancien formulaire, devient fausse avec la refonte.

## Décision

> Nous réorganisons les deux formulaires selon un parcours commun « votre établissement → 1. Provenance → 2. Destination », sans toucher au moteur de règles, et nous retirons la page Aide à l'utilisation de cette version.

1. **Parcours commun** : section « Informations sur votre {établissement} » en tête, puis « 1. Provenance… » et « 2. Destination des viandes » (titres h2, sous-blocs h3). L'affichage progressif ([ADR-0007](./0007-affichage-progressif-champs-simulateurs.md)) est conservé, seul l'ordre des champs change. Le nom de l'établissement vient de `nomEtablissementFor` ([`typeEtablissement.ts`](../../src/features/simulateurs/pages/typeEtablissement.ts)).
2. **ZI FS réflexe côté UI uniquement** : option ajoutée aux listes via `ZONE_OPTIONS_AVEC_REFLEXE`, puis convertie en `Zone.ZIFS` par `zoneMoteur` avant l'appel au moteur ([`common.labels.ts`](../../src/shared/labels/common.labels.ts)).
3. **Infobulle DSFR native** : composant partagé [`InfoTooltip`](../../src/shared/components/InfoTooltip.tsx) (`fr-btn--tooltip` + `fr-tooltip`), animé par le JS DSFR, textes centralisés dans les fichiers de libellés.
4. **Marque sanitaire en radio riche DSFR** (`fr-radio-rich` + `fr-radio-rich__pictogram`), visuels exportés de Figma dans `public/images/marques/{marque}.png`.
5. **Signature Matomo inchangée** : l'ordre des champs de `serialiseCombinaisonAbattoirs` / `serialiseCombinaisonEtablissements` ([ADR-0010](./0010-tracking-combinaisons-event-name.md)) reste l'ordre historique, découplé de l'ordre d'affichage. Le chrono de durée de saisie démarre sur le nouveau 1er champ (zone de l'établissement de l'utilisateur).
6. **Retrait de la page Aide à l'utilisation** : page, route, entrée de menu, lien du plan du site, captures et event `clic_aide_utilisation` supprimés.

## Options envisagées

### ZI FS réflexe

#### Option A — Conversion côté UI vers ZI FS (retenue)

- Avantages : moteur, oracles (2 744 et 32 928 cas) et versions réglementaires inchangés ; équivalence avec ZI FS garantie par construction ; une seule fonction à tester.
- Inconvénients : le moteur et Matomo ne distinguent pas ZI FS de ZI FS réflexe ; si la réglementation les différencie un jour, il faudra migrer vers l'option B.

#### Option B — Nouvelle valeur `Zone.ZIFSReflexe` dans le moteur

- Avantages : distinction explicite de bout en bout (moteur, résultats, analytics).
- Inconvénients : chaque règle doit traiter la nouvelle valeur, les fixtures oracle doivent être régénérées, tout cela pour un comportement identique à ZI FS. Coût et risque de régression sans bénéfice métier à date.

### Infobulles

#### Option A — Infobulle DSFR native (retenue)

- Avantages : conforme DSFR, accessible (survol, focus clavier, `aria-describedby`), aucun CSS custom.
- Inconvénients : dépend du JS DSFR (vérifié : les infobulles rendues dynamiquement par React sont bien initialisées).

#### Option B — Attribut `title` ou composant maison

- Avantages : aucune dépendance au JS DSFR.
- Inconvénients : `title` peu accessible et non stylable ; un composant maison réinvente un composant DSFR existant (interdit par les conventions du projet).

### Ordre de la signature Matomo

#### Option A — Conserver l'ordre historique (retenue)

- Avantages : les agrégats de combinaisons restent comparables avant et après la refonte.
- Inconvénients : l'ordre de la signature ne suit plus celui du formulaire (documenté dans [`combinaison.ts`](../../src/shared/analytics/combinaison.ts)).

#### Option B — Aligner la signature sur le nouvel ordre d'affichage

- Avantages : cohérence visuelle entre formulaire et signature.
- Inconvénients : fragmente les agrégats Matomo existants, ce qu'interdit l'ADR-0010.

### Page Aide à l'utilisation

#### Option A — Retrait de la page dans cette version (retenue)

- Avantages : aucun contenu faux en production ; les infobulles et les textes d'introduction des sections portent désormais l'aide contextuelle.
- Inconvénients : plus de guide pas à pas ; l'indicateur « clics vers la notice » n'est plus mesuré.

#### Option B — Refaire la page avec de nouvelles captures

- Avantages : conserve un guide complet.
- Inconvénients : captures à refaire à chaque évolution du formulaire, alors que la refonte est encore susceptible d'ajustements.

#### Option C — Conserver la page en l'état

- Avantages : aucun travail.
- Inconvénients : captures et libellés contredisent le formulaire réel.

## Conséquences

### Positives

- Parcours identique pour les deux simulateurs, plus proche du raisonnement de l'utilisateur.
- Moteur de règles et oracles non modifiés : aucune régression réglementaire possible par cette refonte.
- Composants et libellés mutualisés (`InfoTooltip`, `ZONE_OPTIONS_AVEC_REFLEXE`, `MCA_TOOLTIP`).
- Tests E2E réécrits avec des libellés centralisés et des helpers de remplissage, plus simples à maintenir.

### Négatives / Risques

- ZI FS réflexe n'est pas distinguable dans Matomo (dimension `zone_suides` et signature reçoivent `zi-fs`) ni dans le panneau de résultats, hormis la mention « Zone infectée faune sauvage réflexe » du bandeau des documents commerciaux (Abattoir).
- La question « Un traitement d'atténuation a-t-il été réalisé ? » (Autres établissements), absente des maquettes mais requise par le moteur, est placée dans « Informations sur les viandes » : à confirmer par le métier.
- Le lien « référez-vous à ce tableau » (tableau des mélanges) pointe vers la page « Niveau de risque des porcs et des viandes » (`/niveau-de-risque`), dont le tableau des viandes attend encore les marques sanitaires de la matière première (cf. [`niveauRisque.ts`](../../src/features/niveau-risque/niveauRisque.ts)).
- L'event `clic_aide_utilisation` décrit dans l'[ADR-0011](./0011-indicateurs-matomo-dimensions-duree-clics.md) n'est plus émis.

### Migration

- Si ZI FS réflexe doit un jour se comporter différemment de ZI FS : ajouter la valeur au shared kernel du moteur (option B), adapter les règles et fixtures, puis supprimer `zoneMoteur`.
- Pour réintroduire une aide : recréer la page à partir des maquettes finales et rétablir l'event de clic dans [`events.ts`](../../src/shared/analytics/events.ts).

## Liens

- Formulaires : [`AbattoirsForm.tsx`](../../src/features/simulateurs/abattoirs/components/AbattoirsForm.tsx), [`EtablissementsForm.tsx`](../../src/features/simulateurs/etablissements/components/EtablissementsForm.tsx)
- Libellés : [`common.labels.ts`](../../src/shared/labels/common.labels.ts), [`abattoirs.labels.ts`](../../src/shared/labels/abattoirs.labels.ts), [`etablissements.labels.ts`](../../src/shared/labels/etablissements.labels.ts)
- Tests E2E : [`simulateur-abattoirs.spec.ts`](../../tests/e2e/simulateur-abattoirs.spec.ts), [`simulateur-etablissements.spec.ts`](../../tests/e2e/simulateur-etablissements.spec.ts)
- Documentation Matomo : [`matomo-funnel.md`](../matomo-funnel.md)
- Documentation DSFR : [Infobulle](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/infobulle), [Bouton radio riche](https://www.systeme-de-design.gouv.fr/version-courante/fr/composants/bouton-radio-riche)
- ADR liés : [ADR-0007](./0007-affichage-progressif-champs-simulateurs.md), [ADR-0010](./0010-tracking-combinaisons-event-name.md), [ADR-0011](./0011-indicateurs-matomo-dimensions-duree-clics.md)
