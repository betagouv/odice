# ADR-0016 : Autres établissements — situations impossibles et valeurs déduites

**Date** : 2026-10-06
**Statut** : Accepté — remplace les simplifications R1 / R2 de l'ancien `traitementFields.ts`

## Contexte

Le simulateur Autres établissements posait jusqu'à trois questions de traitement (obligatoire national, obligatoire UE, réalisé), simplifiées par deux règles d'affichage (R1 : UE masqué si national = oui ; R2 : questions masquées en zone saine). La spec métier « Retirer les situations impossibles » demande :

- de **bloquer** deux situations impossibles : porcs en zone indemne ou ZRI avec une marque ovale barrée ou à diagonales parallèles (mélange de lot probable), et porcs en ZI FS réflexe ;
- de ne poser la question « traitement national » qu'en ZRIII avec une marque spéciale, de **supprimer** la question UE, et de ne poser « réalisé » que pour une ovale barrée ou un traitement national obligatoire ;
- de **déduire** les réponses connues d'avance (règles M1 à M6).

L'analyse de l'oracle (32 928 cas) montre que la spec masque, dans quatre situations, un champ qui influence le résultat sans en donner la valeur.

## Décision

> Nous déduisons dans l'UI toutes les entrées de traitement non posées, selon les règles M1 à M6 de la spec complétées par des hypothèses validées avec le métier, sans modifier le moteur.

- Module pur [`traitementRegles.ts`](../../src/features/simulateurs/etablissements/components/traitementRegles.ts) : `situationImpossible`, `questionTraitementNationalVisible`, `questionTraitementRealiseVisible`, `deduireTraitements`.
- Hypothèses retenues pour les cas non couverts :
  - ZP ou ZS avec une ovale ou des diagonales : traitement national = OUI (par analogie avec M4) ;
  - ZI FS, ZRII ou ZRIII avec une ovale : national = NON et réalisé = NON ;
  - ZRIII à diagonales avec national = NON : réalisé = NON.
- ZI FS réflexe reste proposée dans les listes (cohérence avec Abattoirs) mais déclenche le blocage pour la zone d'origine des porcs.
- Le formulaire masque la destination et bloque Valider tant qu'une situation est impossible ; les questions de traitement ne sont pas posées dans ce cas.

## Options envisagées

### Option A — Déduction côté UI dans un module pur (retenue)

- Avantages : moteur et oracle inchangés ; formulaire plus court ; règles testées unitairement, avec un garde-fou sur l'oracle pour les valeurs « sans effet ».
- Inconvénients : les hypothèses engagent le résultat dans quatre situations ; elles doivent être confirmées par le métier et revues à chaque nouvelle version réglementaire.

### Option B — Continuer à poser les questions dans les cas non couverts

- Avantages : aucune hypothèse, l'utilisateur répond lui-même.
- Inconvénients : contraire à la spec (questions supprimées ou restreintes), et l'utilisateur ne connaît pas toujours la réponse réglementaire attendue.

### Option C — Déduire dans le moteur

- Avantages : une seule source de vérité pour toutes les interfaces.
- Inconvénients : modifie les entrées du moteur et l'oracle, alors que la déduction relève de la saisie et non des règles de sortie.

## Conséquences

### Positives

- Les situations incohérentes ne produisent plus de résultat trompeur.
- Moins de questions, dont la réponse est souvent inconnue de l'utilisateur.

### Négatives / Risques

- Quatre hypothèses de valeur à valider par le métier (cf. tableau dans [`simulateur-etablissements.md`](../simulateur-etablissements.md)).
- La signature Matomo des combinaisons ([ADR-0010](./0010-tracking-combinaisons-event-name.md)) reçoit des valeurs déduites et non saisies pour les questions masquées.

### Migration

- Suppression de `traitementFields.ts` et de ses tests ; `EtablissementsForm` utilise `traitementRegles.ts`.
- Tests E2E réécrits : situations impossibles, questions conditionnelles, résultat avec traitement réalisé.

## Liens

- Règles : [`traitementRegles.ts`](../../src/features/simulateurs/etablissements/components/traitementRegles.ts), tests [`traitementRegles.spec.ts`](../../src/features/simulateurs/etablissements/components/traitementRegles.spec.ts)
- Formulaire : [`EtablissementsForm.tsx`](../../src/features/simulateurs/etablissements/components/EtablissementsForm.tsx)
- ADR liés : [ADR-0013](./0013-refonte-ui-simulateurs-et-retrait-aide.md), [ADR-0014](./0014-affichage-progressif-par-section.md), [ADR-0015](./0015-panneau-resultats-commun-et-masquage.md)
