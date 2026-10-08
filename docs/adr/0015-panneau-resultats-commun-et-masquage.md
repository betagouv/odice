# ADR-0015 : Panneau de résultats commun et masquage des sorties sans objet

**Date** : 2026-10-05
**Statut** : Accepté

## Contexte

Les deux simulateurs avaient chacun leur panneau de résultats (`AbattoirsResult`, `EtablissementsResult`), identiques à 95 % : seul le sous-titre différait, les sorties du moteur ayant la même structure. La nouvelle maquette et la spec « encart sorties » demandent :

- de masquer les sorties sans objet : si le mouvement France est interdit, n'afficher que la possibilité de mouvement ; si le mouvement UE est interdit, retirer les lignes UE du traitement et du document ;
- une nouvelle nomenclature de badges (laissez-passer sanitaire en toutes lettres, « Mouvement interdit sans traitement d'atténuation » pour l'UE quand la marque est une ovale barrée, visuel de la marque) ;
- un bandeau « Mentions à reporter sur les documents commerciaux » reprenant des saisies (zone d'origine, statut) en plus des sorties.

## Décision

> Nous centralisons l'affichage des résultats dans un composant unique `SimulationResult`, avec des règles d'affichage en fonctions pures, sans modifier le moteur.

- [`SimulationResult.tsx`](../../src/features/simulateurs/components/SimulationResult.tsx) : rendu commun, paramétré par le sous-titre, la version réglementaire et les mentions. `AbattoirsResult` et `EtablissementsResult` deviennent de simples adaptateurs (sous-titre, version, saisies).
- [`resultatAffichage.ts`](../../src/features/simulateurs/components/resultatAffichage.ts) : `resultatAffichage` (blocs visibles), `ueInterditSansTraitement` (ovale barrée + UE interdit), `mentionTraitement` (texte du bandeau).
- Mention de traitement du bandeau (spec « bandeau bleu ») : FR obligatoire + UE interdit → « obligatoire pour une mise sur le marché sur le territoire national » ; FR obligatoire + UE interdit sans traitement → « … et pour les échanges intracommunautaires » ; FR non obligatoire + UE interdit sans traitement → « obligatoire uniquement pour les échanges intracommunautaires » ; tout autre cas → pas de ligne traitement. La ligne statut n'existe que pour le simulateur Abattoirs.
- Libellés de sortie dans [`common.labels.ts`](../../src/shared/labels/common.labels.ts) ; les valeurs du moteur restent inchangées.
- Badges DSFR de statut sans icône (`fr-badge--success|error|info fr-badge--no-icon`), conformes aux couleurs de la nomenclature.
- La page conserve les saisies validées avec le résultat, pour alimenter le bandeau des mentions.

## Options envisagées

### Option A — Composant commun et règles d'affichage côté UI (retenue)

- Avantages : une seule implémentation pour les deux simulateurs ; règles testées unitairement ; moteur et oracles inchangés.
- Inconvénients : les règles d'affichage reposent sur des invariants constatés dans les oracles (FR interdit ⇔ aucune marque, ovale barrée ⇒ UE interdit), à revérifier à chaque nouvelle version réglementaire.

### Option B — Nouvelle sortie « interdit sans traitement » dans le moteur

- Avantages : l'information serait explicite dans les sorties.
- Inconvénients : modification des deux moteurs et des fixtures oracle pour une information dérivable de la marque ; aucun gain métier à date.

### Option C — Faire évoluer les deux panneaux séparément

- Avantages : aucune refonte préalable.
- Inconvénients : chaque évolution de maquette à reporter deux fois, risque de divergence.

## Conséquences

### Positives

- Résultats plus lisibles : plus de badges « NON APPLICABLE », seules les informations utiles sont affichées.
- Mentions concrètes à reporter sur les documents commerciaux.
- Toute évolution du panneau se fait à un seul endroit.

### Négatives / Risques

- L'encart « Ne pas oublier » et son lien vers la documentation réglementaire disparaissent du panneau : l'event Matomo `clic_documentation_reglementaire` n'est plus émis que depuis le menu.
- Les mentions affichent la zone d'origine transmise au moteur ; « ZI FS réflexe », bloquée comme zone d'origine des porcs, n'y apparaît jamais (cf. [ADR-0013](./0013-refonte-ui-simulateurs-et-retrait-aide.md)).
- Les libellés « Laissez-passer sanitaire non requis », « Dérogation au certificat zoosanitaire possible » et « Certificat zoosanitaire non requis », absents de la nomenclature, sont des propositions à valider par le métier.

### Migration

- Suppression du placeholder `src/shared/components/ResultPanel.tsx`, inutilisé.
- Tests E2E mis à jour avec les nouveaux libellés ; cas ajoutés pour FR interdit, ovale barrée et mentions.

## Liens

- Composants : [`SimulationResult.tsx`](../../src/features/simulateurs/components/SimulationResult.tsx), [`AbattoirsResult.tsx`](../../src/features/simulateurs/abattoirs/components/AbattoirsResult.tsx), [`EtablissementsResult.tsx`](../../src/features/simulateurs/etablissements/components/EtablissementsResult.tsx)
- Règles : [`resultatAffichage.ts`](../../src/features/simulateurs/components/resultatAffichage.ts)
- Documentation métier : [`simulateur-abattoirs.md`](../simulateur-abattoirs.md)
- ADR liés : [ADR-0013](./0013-refonte-ui-simulateurs-et-retrait-aide.md), [ADR-0011](./0011-indicateurs-matomo-dimensions-duree-clics.md)
