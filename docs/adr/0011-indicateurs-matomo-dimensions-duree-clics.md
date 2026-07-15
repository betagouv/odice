# ADR-0011 : Indicateurs Matomo — dimensions profils, durée de saisie et clics annexes

**Date** : 2026-07-15
**Statut** : Accepté

## Contexte

L'équipe produit a défini une liste d'indicateurs à piloter dans Matomo (utilisation, parcours utilisateur, profils, pages annexes). Le tracking existant ([ADR-0008](./0008-analytics-matomo-wrapper-maison.md), [ADR-0010](./0010-tracking-combinaisons-event-name.md)) couvre déjà, sans code supplémentaire, les indicateurs de volume et de parcours (pages vues, `*_simulateur_ouvert`, `*_simulation_lancee`, `*_resultat_affiche`, `*_reinitialisation`) : ils se lisent en visiteurs uniques par mois, éventuellement via un segment (réinitialisation **et** validation).

Trois besoins restaient non couverts par l'instrumentation :

1. **Profils** : ventiler les validations par **type d'établissement** et par **zone d'origine des suidés**.
2. **Temps moyen** entre le renseignement de la 1ère information (zone d'origine) et la validation.
3. **Clics** vers les pages annexes : aide à l'utilisation, documentation réglementaire, carte des zones réglementées.

## Décision

> Étendre le modèle d'events analytics avec (a) deux **custom dimensions action-scope** sur la validation, (b) un event dédié portant la **durée en Event Value**, (c) un vocabulaire d'**events de clic annexes**. Aucune nouvelle dépendance ; réutilisation du pipeline `trackEvent(event, options, customDimensions)` existant.

- **Dimensions profils** ([`dimensions.ts`](../../src/shared/analytics/dimensions.ts)) : `type_etablissement` (valeur fine des 5 types, plus riche que la `famille` déjà encodée dans l'action) et `zone_suides`, passées en 3ᵉ argument de `trackEvent` sur `*_resultat_affiche`. Le helper `buildCustomDimensions` n'émet une dimension que si son ID est configuré (`VITE_MATOMO_DIMENSION_<NOM>_ID`) : aucune fuite si l'env manque. C'est la concrétisation, ciblée sur les profils, de la « Phase 2 » anticipée par l'ADR-0010.
- **Durée de saisie** : step `MATOMO_STEPS.DUREE = "duree_saisie"`. La page horodate la 1ère saisie (callback `onStart` levé par le formulaire au 1er renseignement de `zoneSuides`) et émet `*_duree_saisie` avec `value` = secondes à la validation. Lecture Matomo : colonne « Valeur moyenne ». Le chrono est réarmé sur réinitialisation et changement de type.
- **Clics annexes** : `MATOMO_ANNEXES` (`clic_aide_utilisation`, `clic_documentation_reglementaire`, `clic_carte_zones`) et élargissement du type `MatomoAction = MatomoEventName | MatomoAnnexe` accepté par `trackEvent`. Émis via `onClick` sur la navigation, `CarteZonesHint` et le lien documentation des panneaux résultat.

La **région** n'a pas de source de données (le formulaire modélise la géographie en « zones » réglementaires PPA, pas administratives) : elle repose sur la géolocalisation IP native de Matomo, sans code.

## Options envisagées

### Dimensions profils : dimension dédiée (retenue) vs. dérivation depuis la combinaison

- **Retenue** : dimensions `type_etablissement` / `zone_suides`. Isolables directement, croisables avec les rapports natifs (dont Lieux pour la région), zéro parsing.
- **Rejetée** : réextraire type/zone depuis la signature `*_combinaison_soumise` (ADR-0010). Nécessiterait du découpage de chaîne côté analyse et ne se croise pas avec les autres rapports.

### Durée : event value dédié (retenue) vs. value sur un event de funnel existant

- **Retenue** : event `*_duree_saisie` distinct. Sémantique de la valeur non ambiguë, funnel inchangé.
- **Rejetée** : accrocher la value à `*_simulation_lancee` / `*_resultat_affiche`. Mélange volume et durée sur une même action et brouille la lecture.

### Clics annexes : events dédiés (retenue) vs. pages vues + outlinks natifs

- **Retenue** : events `clic_*` nommés. Indicateur « clics » exact et isolable, cohérent avec l'existant.
- **Rejetée** : compter les pages vues de `/aide-utilisation` et `/documentation-reglementaire` + outlink natif pour la carte. Zéro code mais mélange les sources d'accès (accès direct, menu, lien résultat) et l'outlink carte est peu lisible.

## Conséquences

### Positives

- Les 12 indicateurs demandés sont pilotables ; le mapping « indicateur → où le lire » est documenté dans [`docs/matomo-funnel.md`](../matomo-funnel.md).
- Réutilise intégralement le pipeline existant (dimensions set→track→delete, env `VITE_MATOMO_DIMENSION_*_ID`) : ~zéro dette.
- `buildCustomDimensions` testé et tolérant à l'absence de configuration.

### Négatives / Risques

- **Config Matomo requise** hors code : créer les 2 dimensions action-scope, relever leurs IDs, poser les env sur Scalingo. Tant que ce n'est pas fait, la validation est trackée sans dimensions.
- **Région approximative** : la géoloc IP localise le navigateur, pas l'établissement. Un vrai axe région serait une évolution produit (champ dédié).
- Le lien « documentation réglementaire » des panneaux résultat pointe désormais vers la **route interne** (auparavant un placeholder `example.com`) : à confirmer si une URL officielle externe est préférée.

## Liens

- Helper dimensions : [`src/shared/analytics/dimensions.ts`](../../src/shared/analytics/dimensions.ts)
- Events : [`src/shared/analytics/events.ts`](../../src/shared/analytics/events.ts)
- Émission : [`src/features/simulateurs/pages/SimulateursIndexPage.tsx`](../../src/features/simulateurs/pages/SimulateursIndexPage.tsx)
- Doc Matomo : [`docs/matomo-funnel.md`](../matomo-funnel.md)
- ADR-0008 (wrapper analytics maison), ADR-0010 (combinaisons via Event Name)
