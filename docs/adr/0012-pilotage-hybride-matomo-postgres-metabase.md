# ADR-0012 : Pilotage hybride Matomo + Postgres/Metabase

**Date** : 2026-07-15
**Statut** : Proposé

## Contexte

Les 12 indicateurs produit sont aujourd'hui pilotés dans **Matomo** (mesure d'audience cookieless, sans consentement — cf. [ADR-0009](./0009-mesure-audience-cookieless.md), [ADR-0011](./0011-indicateurs-matomo-dimensions-duree-clics.md)). C'est robuste et déjà en place, mais Matomo a des limites intrinsèques pour du pilotage produit fin :

- **Compteurs de « personnes / mois »** imprécis : en cookieless, l'identifiant visiteur se réinitialise, l'unicité sur un mois est estimée, pas mesurée.
- **Croisements** limités : `type × zone × mois`, `réinitialise ET valide`, distributions de durée (médiane/p90)… nécessitent segments ou Custom Reports, moins souples que du SQL.
- **Complétude** : le tracker tiers est en partie bloqué par les extensions de confidentialité.
- **Région** : géoloc IP client approximative, aucun croisement métier possible.

Une **base Postgres** est prévue à terme pour d'autres besoins. La question posée : un pilotage via Metabase sur cette base serait-il plus précis que Matomo ?

## Décision

> **Approche hybride, pas remplacement.** Conserver Matomo pour l'audience/acquisition ; ajouter, quand Postgres arrivera, un **sink d'événements first-party** (`POST /events` → table `events` → Metabase) pour les indicateurs où Matomo est faible, avec un **identifiant anonyme persistant côté front** pour fiabiliser le comptage de personnes.

- **Matomo** garde : arrivées landing, sources, pages vues, funnel de parcours — son terrain, zéro backend.
- **Postgres/Metabase** prend : cross-tabs profils exacts (`type × zone × mois`), `réinitialise ET valide`, distributions de durée, et tout indicateur joignable à un futur contexte métier.
- **Identité** : un identifiant aléatoire anonyme en `localStorage` (non cross-site, jamais relié à une identité, pattern déjà éprouvé par l'équipe sur un autre projet) rend le « nombre de personnes / mois » **mesuré** et non plus estimé. C'est le vrai déblocage de précision — pas le changement de stockage en lui-même.
- **Réutilisation** : les événements sont déjà structurés et centralisés dans `trackEvent` ([`useMatomo.ts`](../../src/shared/analytics/useMatomo.ts)) ; le pipeline d'erreurs prévoit déjà un envoi vers un endpoint configurable (`VITE_ERROR_ENDPOINT`, Phase 2 du monitoring). Le dual-send analytics est donc un **ajout local**, pas une réécriture.

## Options envisagées

### Option A — Matomo seul (statu quo)

- Avantages : déjà livré, cookieless sans consentement, filtrage bots natif, zéro backend/AIPD supplémentaire.
- Inconvénients : compteurs de personnes estimés, cross-tabs limités, sensible aux bloqueurs, pas de jointure métier.

### Option B — Remplacer Matomo par Postgres/Metabase

- Avantages : précision et flexibilité SQL maximales, données maîtrisées.
- Inconvénients : perte des rapports d'acquisition/audience « gratuits » de Matomo ; à reconstruire (bots, référents, géoloc) ; effort le plus élevé pour un périmètre déjà couvert.

### Option C — Hybride (retenue)

- Avantages : chaque outil sur son terrain ; précision là où elle manque (profils, durées, unicité via ID anonyme) ; résistance aux bloqueurs (POST first-party) ; jointures métier possibles ; réutilise le pattern d'endpoint existant.
- Inconvénients : deux systèmes à maintenir ; endpoint d'ingestion + schéma + filtrage bots maison ; **décision RGPD** à prendre (base légale / AIPD / durée de conservation) pour l'ID persistant et le stockage d'événements comportementaux — arbitrage plus lourd que le cookieless actuel.

## Conséquences

### Positives

- Précision réelle sur les indicateurs profils, les durées et le comptage de personnes.
- Migration incrémentale : on branche le sink indicateur par indicateur, Matomo reste la référence tant que le sink n'est pas mûr.

### Négatives / Risques

- **Prérequis bloquant** : trancher la conformité de l'identifiant anonyme persistant (base légale, AIPD, rétention) avant tout déploiement. Sans ID persistant, Postgres n'améliore pas les compteurs de personnes.
- Coût de maintenance d'un pipeline maison (ingestion, schéma/migrations, bots, qualité de données).
- Risque de divergence de chiffres entre Matomo et Metabase (définitions d'unicité différentes) : documenter quelle source fait foi pour quel indicateur.

### Migration (le jour venu)

1. Décision RGPD sur l'ID anonyme persistant + stockage d'événements.
2. Endpoint `POST /events` (Scalingo/Node) + table `events(ts, type, simulateur, type_etab, zone_suides, duree_s, session_id, …)`.
3. Générer/persister l'ID anonyme côté front ; dual-send depuis `trackEvent` (réutiliser le pattern `VITE_*_ENDPOINT`).
4. Tableaux Metabase pour les indicateurs « précision » ; garder Matomo pour l'audience.

## Liens

- ADR-0009 (mesure d'audience cookieless), ADR-0011 (dimensions/durée/clics Matomo)
- Doc : [`docs/matomo-funnel.md`](../matomo-funnel.md)
- Monitoring Phase 2 (`VITE_ERROR_ENDPOINT`) : `src/shared/monitoring/error-reporter.ts`
